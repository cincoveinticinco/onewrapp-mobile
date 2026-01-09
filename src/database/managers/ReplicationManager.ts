/**
 * ReplicationManager - Orquesta todas las replicaciones del sistema
 * Maneja el ciclo de vida de replicadores y su sincronización
 */

import HttpReplicator from '../core/replicator';
import DatabaseSchema from '../core/database_schema';
import { databaseManager } from './DatabaseManager';
import { DeletedRecordsHandler } from './DeletedRecordsHandler';
import { dbEvents } from '../events';
import { DatabaseInstance, ReplicationSelector, ReplicationStep } from '../types';
import { BehaviorSubject } from 'rxjs';

export class ReplicationManager {
  private static instance: ReplicationManager;
  
  // Replicadores activos (equivalente a los refs del contexto)
  private replicators: Map<string, HttpReplicator> = new Map();
  
  // Handler de registros eliminados
  private deletedRecordsHandler: DeletedRecordsHandler | null = null;
  
  // Estado
  private currentProjectId: number | null = null;
  private isOnline: boolean = false;
  private getToken: (() => Promise<string>) | null = null;
  
  // Flags de control
  private initialProjectReplicationInCourse = false;
  private allReplicationsInCourse = false;
  
  // Timer para cancelar incrementos de porcentaje
  private cancelCurrentIncrement: (() => void) | null = null;
  
  // Rango del step actual (para calcular progreso ponderado)
  private currentStepRange: { start: number; end: number } | null = null;

  // Control de polling para evitar cruces con replicaciones manuales
  private pollingEnabled$ = new BehaviorSubject<boolean>(true);
  private pollingPauseCount = 0;

  private constructor() {
    // Private para singleton
  }
  
  public static getInstance(): ReplicationManager {
    if (!ReplicationManager.instance) {
      ReplicationManager.instance = new ReplicationManager();
    }
    return ReplicationManager.instance;
  }

  /**
   * Calcular progreso total basado en el porcentaje del esquema actual
   * Si el esquema está al X%, y ocupa del start% al end%, 
   * el progreso total es: start + (X/100 * (end - start))
   */
  private calculateTotalProgress(schemaPercentage: number): number {
    if (!this.currentStepRange) return 0;
    
    const { start, end } = this.currentStepRange;
    const stepWeight = end - start;
    const clampedPercentage = Math.max(0, Math.min(100, schemaPercentage));
    const contribution = (clampedPercentage / 100) * stepWeight;
    const total = start + contribution;
    const boundedTotal = Math.max(start, Math.min(end, total));
    
    console.log(`🧮 Calculating: ${schemaPercentage}% in range [${start}-${end}] = ${boundedTotal}%`);
    
    return Number(boundedTotal.toFixed(2));
  }

  /**
   * Configurar el replication manager
   */
  public configure(isOnline: boolean, getToken: () => Promise<string>): void {
    this.isOnline = isOnline;
    this.getToken = getToken;
    
    const db = databaseManager.getDatabase();
    if (db && getToken) {
      this.deletedRecordsHandler = new DeletedRecordsHandler(db, getToken);
    }
  }

  /**
   * Establecer proyecto actual
   */
  public setProjectId(projectId: number | null): void {
    if (this.currentProjectId !== projectId) {
      this.currentProjectId = projectId;
      // Limpiar replicadores del proyecto anterior
      this.cleanupReplicators();
    }
  }

  private pausePolling(): void {
    this.pollingPauseCount += 1;
    this.pollingEnabled$.next(this.pollingPauseCount === 0);
  }

  private resumePolling(): void {
    this.pollingPauseCount = Math.max(0, this.pollingPauseCount - 1);
    this.pollingEnabled$.next(this.pollingPauseCount === 0);
  }

  /**
   * Obtener proyecto actual
   */
  public getProjectId(): number | null {
    return this.currentProjectId;
  }

  /**
   * Inicializar replicación genérica
   */
  private async initializeReplication(
    collection: DatabaseSchema,
    selector: ReplicationSelector,
    replicatorKey: string,
    projectId: number | null = null
  ): Promise<boolean> {
    const db = databaseManager.getDatabase();
    
    if (!db || !collection || (projectId && !projectId)) {
      const failedData = !projectId
        ? 'Project Id not found'
        : !db
        ? 'Database not initialized'
        : !collection
        ? 'Collection not found'
        : 'Invalid initialization parameters';
      throw new Error('Invalid initialization parameters ' + failedData);
    }

    if (!this.getToken) {
      throw new Error('getToken function not configured');
    }

    const canPush = ['scenes', 'shootings', 'crew'].includes(collection.SchemaName().toLowerCase());

    const lastItem = await db[collection.SchemaName()]
      .find({ selector })
      .sort({ updatedAt: 'desc' })
      .limit(1)
      .exec()
      .then((data: any) => (data[0] ? data[0] : null));

    const scopedReplicatorKey = projectId ? `${replicatorKey}-${projectId}` : replicatorKey;
    const existingReplicator = this.replicators.get(scopedReplicatorKey);

    // Callback para progreso
    const onProgress = (percentage: number) => {
      // Solo emitir progreso si estamos dentro de initializeAllReplications
      // (currentStepRange estará configurado)
      if (this.currentStepRange) {
        const totalPercentage = this.calculateTotalProgress(percentage);
        console.log(`🎯 Progress callback - Schema: ${collection.SchemaName()}, Schema%: ${percentage}%, Range: [${this.currentStepRange.start}-${this.currentStepRange.end}], Total%: ${totalPercentage}%`);
        dbEvents.emit('replication:progress', {
          percentage: totalPercentage,
          status: `Replicating ${collection.SchemaName()}... ${Math.round(percentage)}%`,
        });
      }
      // Si currentStepRange es null, simplemente ignorar (replicación automática en background)
    };

    if (!existingReplicator) {
      console.log(`Creating new replicator for ${collection.SchemaName()} - Project ${projectId}`);
      
      const replicator = new HttpReplicator(
        db,
        [collection],
        projectId,
        lastItem,
        this.getToken,
        onProgress,
        this.pollingEnabled$
      );
      
      if (this.isOnline) {
        await replicator.startReplication(true, canPush);
        this.replicators.set(scopedReplicatorKey, replicator);
      }
    } else {
      console.log(`Reusing existing replicator for ${collection.SchemaName()}  - Project ${projectId}`);
      
      // Actualizar el callback para que use el currentStepRange correcto
      existingReplicator.updateOnProgressCallback(onProgress);
      
      if (this.isOnline) {
        await existingReplicator.resyncReplication();
      }
    }

    return true;
  }

  /**
   * Replicación inicial de proyectos y usuarios
   */
  public async initializeProjectsUserReplication(): Promise<void> {
    await this.initializeReplication(
      databaseManager.projectCollection!,
      {},
      'projects-users'
    );
    await this.initializeReplication(
      databaseManager.userCollection!,
      {},
      'users'
    );
  }

  /**
   * Replicación de escenas
   */
  private async initializeSceneReplication(): Promise<void> {
    if (!this.currentProjectId) {
      throw new Error('Project Id not found');
    }

    await this.initializeReplication(
      databaseManager.sceneCollection!,
      { projectId: this.currentProjectId, createdAtBack: { $exists: true } },
      'scenes',
      this.currentProjectId
    );
    
    if (this.deletedRecordsHandler) {
      await this.deletedRecordsHandler.handleDeletedRecords(
        'scenes',
        'get_deleted_scenes',
        this.currentProjectId.toString()
      );
    }
  }

  /**
   * Replicación de service matrices
   */
  private async initializeServiceMatricesReplication(): Promise<void> {
    if (!this.currentProjectId) {
      throw new Error('Project Id not found');
    }

    await this.initializeReplication(
      databaseManager.serviceMatricesCollection!,
      { projectId: this.currentProjectId, createdAtBack: { $exists: true } },
      'service-matrices',
      this.currentProjectId
    );
    
    if (this.deletedRecordsHandler) {
      await this.deletedRecordsHandler.handleDeletedRecords(
        'service_matrices',
        'get_deleted_service_matrices',
        this.currentProjectId.toString()
      );
    }
  }

  /**
   * Replicación de proj weeks
   */
  private async initializeProjWeekReplication(): Promise<void> {
    if (!this.currentProjectId) {
      throw new Error('Project Id not found');
    }

    await this.initializeReplication(
      databaseManager.projWeeksCollection!,
      { projectId: this.currentProjectId },
      'proj-weeks',
      this.currentProjectId
    );
  }

  /**
   * Replicación de stripboard
   */
  private async initializeStripboardReplication(): Promise<void> {
    if (!this.currentProjectId) {
      throw new Error('Project Id not found');
    }

    await this.initializeReplication(
      databaseManager.stripboardCollection!,
      { projectId: this.currentProjectId },
      'stripboard',
      this.currentProjectId
    );
  }

  /**
   * Replicación de párrafos
   */
  private async initializeParagraphReplication(): Promise<void> {
    if (!this.currentProjectId) {
      throw new Error('Project Id not found');
    }

    await this.initializeReplication(
      databaseManager.paragraphCollection!,
      { projectId: this.currentProjectId },
      'paragraphs',
      this.currentProjectId
    );
    
    if (this.deletedRecordsHandler) {
      await this.deletedRecordsHandler.handleDeletedRecords(
        'paragraphs',
        'get_deleted_paragraphs',
        this.currentProjectId.toString()
      );
    }
  }

  /**
   * Replicación de talents
   */
  private async initializeTalentsReplication(): Promise<void> {
    if (!this.currentProjectId) {
      throw new Error('Project Id not found');
    }

    await this.initializeReplication(
      databaseManager.talentsCollection!,
      { projectId: this.currentProjectId },
      'talents',
      this.currentProjectId
    );
    
    if (this.deletedRecordsHandler) {
      await this.deletedRecordsHandler.handleDeletedRecords(
        'talents',
        'get_deleted_talents',
        this.currentProjectId.toString()
      );
    }
  }

  /**
   * Replicación de units
   */
  private async initializeUnitReplication(): Promise<void> {
    if (!this.currentProjectId) {
      throw new Error('Project Id not found');
    }

    await this.initializeReplication(
      databaseManager.unitsCollection!,
      { projectId: this.currentProjectId },
      'units',
      this.currentProjectId
    );
    
    if (this.deletedRecordsHandler) {
      await this.deletedRecordsHandler.handleDeletedRecords(
        'units',
        'get_deleted_units',
        this.currentProjectId.toString()
      );
    }
  }

  /**
   * Replicación de shootings
   */
  private async initializeShootingReplication(): Promise<void> {
    if (!this.currentProjectId) {
      throw new Error('Project Id not found');
    }

    await this.initializeReplication(
      databaseManager.shootingsCollection!,
      { projectId: this.currentProjectId, createdAtBack: { $exists: true } },
      'shootings',
      this.currentProjectId
    );
    
    if (this.deletedRecordsHandler) {
      await this.deletedRecordsHandler.handleDeletedRecords(
        'shootings',
        'get_deleted_shootings',
        this.currentProjectId.toString()
      );
    }
  }

  /**
   * Replicación de crew
   */
  private async initializeCrewReplication(): Promise<void> {
    if (!this.currentProjectId) {
      throw new Error('Project Id not found');
    }

    await this.initializeReplication(
      databaseManager.crewCollection!,
      { projectId: this.currentProjectId },
      'crew',
      this.currentProjectId
    );
    
    if (this.deletedRecordsHandler) {
      await this.deletedRecordsHandler.handleDeletedRecords(
        'crew',
        'get_deleted_crew',
        this.currentProjectId.toString()
      );
    }
  }

  /**
   * Replicación de countries
   */
  private async initializeCountriesReplication(): Promise<void> {
    await this.initializeReplication(
      databaseManager.countriesCollection!,
      {},
      'countries'
    );
  }

  /**
   * Inicializar todas las replicaciones de un proyecto
   */
  public async initializeAllReplications(): Promise<boolean> {
    if (this.initialProjectReplicationInCourse || this.allReplicationsInCourse) {
      console.warn(
        (this.initialProjectReplicationInCourse
          ? 'initialProjectReplicationInCourse'
          : 'allReplicationsInCourse') + ' is in course'
      );
      return false;
    }

    this.allReplicationsInCourse = true;
    this.pausePolling();
    console.info('Starting all replications...');

    const replicationsArray = [
      this.initializeProjectsUserReplication.bind(this),
      this.initializeSceneReplication.bind(this),
      this.initializeServiceMatricesReplication.bind(this),
      this.initializeParagraphReplication.bind(this),
      this.initializeTalentsReplication.bind(this),
      this.initializeUnitReplication.bind(this),
      this.initializeShootingReplication.bind(this),
      this.initializeCrewReplication.bind(this),
      this.initializeCountriesReplication.bind(this),
      this.initializeProjWeekReplication.bind(this),
      this.initializeStripboardReplication.bind(this),
    ];

    try {
      for (const replication of replicationsArray) {
        try {
          await replication();
        } catch (error) {
          console.error(`Error in replication function ${replication.name}:`, error);
        }
      }
      console.info('All replications completed successfully');
      return true;
    } catch (error) {
      console.error('Unhandled error in initializeAllReplications:', error);
      return false;
    } finally {
      this.resumePolling();
      this.allReplicationsInCourse = false;
    }
  }

  /**
   * Replicación inicial de un proyecto (con progress tracking)
   */
  public async initialProjectReplication(): Promise<void> {
    if (this.allReplicationsInCourse || this.initialProjectReplicationInCourse) {
      return;
    }

    let currentStep: string = '';

    try {
      if (!this.currentProjectId) {
        throw new Error('Project Id not found');
      }

      this.initialProjectReplicationInCourse = true;
      this.pausePolling();
      
      dbEvents.emit('replication:progress', {
        percentage: 0,
        status: 'Starting replication...',
      });

      const steps: ReplicationStep[] = [
        {
          name: 'Scene',
          startPercentage: 0,
          endPercentage: 10,
          function: this.initializeSceneReplication.bind(this),
        },
        {
          name: 'Countries',
          startPercentage: 10,
          endPercentage: 15,
          function: this.initializeCountriesReplication.bind(this),
        },
        {
          name: 'Service Matrices',
          startPercentage: 15,
          endPercentage: 20,
          function: this.initializeServiceMatricesReplication.bind(this),
        },
        {
          name: 'Paragraph',
          startPercentage: 20,
          endPercentage: 40,
          function: this.initializeParagraphReplication.bind(this),
        },
        {
          name: 'Unit',
          startPercentage: 40,
          endPercentage: 50,
          function: this.initializeUnitReplication.bind(this),
        },
        {
          name: 'Talent',
          startPercentage: 50,
          endPercentage: 60,
          function: this.initializeTalentsReplication.bind(this),
        },
        {
          name: 'Shooting',
          startPercentage: 60,
          endPercentage: 70,
          function: this.initializeShootingReplication.bind(this),
        },
        {
          name: 'Crew',
          startPercentage: 70,
          endPercentage: 90,
          function: this.initializeCrewReplication.bind(this),
        },
        {
          name: 'Stripboard',
          startPercentage: 90,
          endPercentage: 95,
          function: this.initializeStripboardReplication.bind(this),
        },
        {
          name: 'Project Weeks',
          startPercentage: 95,
          endPercentage: 100,
          function: this.initializeProjWeekReplication.bind(this),
        },
      ];

      for (const step of steps) {
        currentStep = step.name;
        
        // Establecer el rango del step actual para cálculo de progreso ponderado
        this.currentStepRange = {
          start: step.startPercentage,
          end: step.endPercentage,
        };
        
        dbEvents.emit('replication:progress', {
          percentage: step.startPercentage,
          status: `Starting ${step.name} replication...`,
          currentStep: step.name,
        });

        await step.function();

        dbEvents.emit('replication:progress', {
          percentage: step.endPercentage,
          status: `${step.name} replication completed`,
          currentStep: step.name,
        });
      }
      
      // Limpiar el rango
      this.currentStepRange = null;

      dbEvents.emit('replication:progress', {
        percentage: 100,
        status: 'Replication finished',
      });

      dbEvents.emit('replication:complete', {
        projectId: this.currentProjectId,
      });

    } catch (error: any) {
      dbEvents.emit('replication:error', {
        error,
        step: currentStep,
      });
      
      dbEvents.emit('replication:progress', {
        percentage: 0,
        status: `Error during ${currentStep} replication: ${error.message}`,
      });
      
      throw error;
    } finally {
      this.resumePolling();
      this.initialProjectReplicationInCourse = false;
    }
  }

  /**
   * Incrementar porcentaje de forma gradual (para UI)
   */
  private incrementPercentage(start: number, end: number, duration: number): void {
    // Cancelar la ejecución anterior si existe
    if (this.cancelCurrentIncrement) {
      this.cancelCurrentIncrement();
    }

    let current = start;
    const step = (end - start) / (duration / 10);
    let timer: NodeJS.Timeout;

    const increment = () => {
      current += step;
      if (current >= end) {
        clearInterval(timer);
        dbEvents.emit('replication:progress', {
          percentage: end,
          status: 'In progress...',
        });
        this.cancelCurrentIncrement = null;
      } else {
        dbEvents.emit('replication:progress', {
          percentage: Math.round(current),
          status: 'In progress...',
        });
      }
    };

    timer = setInterval(increment, 10);

    this.cancelCurrentIncrement = () => {
      clearInterval(timer);
      this.cancelCurrentIncrement = null;
    };
  }

  /**
   * Limpiar replicadores activos
   */
  private async cleanupReplicators(): Promise<void> {
    const replicatorsArray = Array.from(this.replicators.values());

    await Promise.all(
      replicatorsArray.map(
        (replicator) =>
          new Promise<void>((resolve) => {
            try {
              replicator.cancelReplication();
              setTimeout(resolve, 100);
            } catch (e) {
              console.warn('Error cancelling replication:', e);
              resolve();
            }
          })
      )
    );

    this.replicators.clear();
  }

  /**
   * Hard resync - limpia replicadores y datos
   */
  public async hardResync(): Promise<void> {
    await this.cleanupReplicators();
    await databaseManager.hardResync();
    await this.initialProjectReplication();
  }
}

// Export singleton instance
export const replicationManager = ReplicationManager.getInstance();
