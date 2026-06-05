/**
 * DatabaseManager - Singleton para manejo del ciclo de vida de RxDB
 * Desacoplado de React, consumible como API
 */

import AppDataBase from '../core/database';
import HttpReplicator from '../core/replicator';
import CrewSchema from '../schemas/crew.schema';
import SceneParagraphsSchema from '../schemas/paragraphs.schema';
import ProjectsSchema from '../schemas/projects.schema';
import ScenesSchema from '../schemas/scenes.schema';
import ShootingsSchema from '../schemas/shootings.schema';
import TalentsSchema from '../schemas/talents.schema';
import UnitsSchema from '../schemas/units.schema';
import CountriesSchema from '../schemas/country.schema';
import ServiceMatricesSchema from '../schemas/serviceMatrices.schema';
import UserSchema from '../schemas/user.schema';
import ProjWeeksSchema from '../schemas/projWeeks.schema';
import StripboardSchema from '../schemas/stripboard.schema';
import { DatabaseInstance } from '../types';
import { dbEvents } from '../events';

class DatabaseManager {
  private static instance: DatabaseManager;
  private dbInstance: DatabaseInstance | null = null;
  private initializationPromise: Promise<DatabaseInstance> | null = null;
  private isInitializing = false;

  // Colecciones (schemas)
  public sceneCollection: ScenesSchema | null = null;
  public paragraphCollection: SceneParagraphsSchema | null = null;
  public projectCollection: ProjectsSchema | null = null;
  public unitsCollection: UnitsSchema | null = null;
  public shootingsCollection: ShootingsSchema | null = null;
  public talentsCollection: TalentsSchema | null = null;
  public crewCollection: CrewSchema | null = null;
  public serviceMatricesCollection: ServiceMatricesSchema | null = null;
  public projWeeksCollection: ProjWeeksSchema | null = null;
  public stripboardCollection: StripboardSchema | null = null;
  public userCollection: UserSchema | null = null;
  public countriesCollection: CountriesSchema | null = null;

  private projectsSubscription: { unsubscribe: () => void } | null = null;

  private constructor() {
    // Private para singleton
  }

  /**
   * Obtener instancia del singleton
   */
  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  /**
   * Inicializar solo la base de datos local (sin replicación)
   * Puede llamarse ANTES de React, no necesita isOnline ni getToken
   */
  public async initializeDatabase(): Promise<DatabaseInstance> {
    console.log('[DatabaseManager] initializeDatabase() called', { alreadyInitialized: !!this.dbInstance });
    
    if (this.dbInstance) {
      console.log('[DatabaseManager] Returning existing instance');
      return this.dbInstance;
    }

    if (this.initializationPromise) {
      console.log('[DatabaseManager] Waiting for existing initialization promise');
      return this.initializationPromise;
    }

    console.log('[DatabaseManager] Starting database creation...');
    this.initializationPromise = this.createDatabaseOnly();
    
    try {
      const db = await this.initializationPromise;
      this.dbInstance = db;
      console.log('[DatabaseManager] Database initialized successfully!');
      dbEvents.emit('database:ready', db);
      return db;
    } catch (error) {
      console.error('[DatabaseManager] Initialization failed:', error);
      this.initializationPromise = null;
      dbEvents.emit('database:error', error as Error);
      throw error;
    }
  }

  /**
   * Inicializar base de datos (idempotente)
   * @deprecated Use initializeDatabase() + setupReplication() separadamente
   */
  public async initialize(isOnline: boolean, getToken: () => Promise<string>): Promise<DatabaseInstance> {
    console.log('[DatabaseManager] initialize() called', { isOnline, alreadyInitialized: !!this.dbInstance });
    
    // Primero inicializar la DB si no existe
    const db = await this.initializeDatabase();
    
    // Luego hacer replicación inicial si está online
    if (isOnline) {
      await this.setupInitialReplication(getToken);
    }
    
    return db;
  }

  /**
   * Crear solo la instancia de RxDB sin replicación
   */
  private async createDatabaseOnly(): Promise<DatabaseInstance> {
    try {
      console.log('[DatabaseManager] createDatabaseOnly() starting...');
      this.isInitializing = true;

      // Crear schemas
      console.log('[DatabaseManager] Creating schemas...');
      const sceneColl = new ScenesSchema();
      const paragraphColl = new SceneParagraphsSchema();
      const projectColl = new ProjectsSchema();
      const unitsColl = new UnitsSchema();
      const shootingsColl = new ShootingsSchema();
      const talentsColl = new TalentsSchema();
      const crewColl = new CrewSchema();
      const countriesCollection = new CountriesSchema();
      const serviceMatricesCollection = new ServiceMatricesSchema();
      const userCollection = new UserSchema();
      const projWeeksCollection = new ProjWeeksSchema();
      const stripboardCollection = new StripboardSchema();

      // Guardar referencias a schemas
      this.sceneCollection = sceneColl;
      this.paragraphCollection = paragraphColl;
      this.projectCollection = projectColl;
      this.unitsCollection = unitsColl;
      this.shootingsCollection = shootingsColl;
      this.talentsCollection = talentsColl;
      this.crewCollection = crewColl;
      this.countriesCollection = countriesCollection;
      this.serviceMatricesCollection = serviceMatricesCollection;
      this.userCollection = userCollection;
      this.projWeeksCollection = projWeeksCollection;
      this.stripboardCollection = stripboardCollection;

      // Crear base de datos RxDB
      const RXdatabase = new AppDataBase([
        sceneColl,
        projectColl,
        paragraphColl,
        unitsColl,
        shootingsColl,
        talentsColl,
        crewColl,
        countriesCollection,
        serviceMatricesCollection,
        userCollection,
        projWeeksCollection,
        stripboardCollection,
      ]);

      const dbInstance = await RXdatabase.getDatabaseInstance();
      console.log('[DatabaseManager] RxDB instance created successfully');

      this.isInitializing = false;
      console.log('[DatabaseManager] Database creation complete!');
      return dbInstance as DatabaseInstance;
    } catch (error) {
      this.isInitializing = false;
      throw error;
    }
  }

  /**
   * Configurar replicación inicial de proyectos y usuarios
   */
  private async setupInitialReplication(getToken: () => Promise<string>): Promise<void> {
    if (!this.dbInstance) {
      throw new Error('Database must be initialized before setting up replication');
    }

    console.log('[DatabaseManager] Setting up initial replication (projects and users)...');
    
    const projectsReplicator = new HttpReplicator(this.dbInstance, [this.projectCollection!], null, null, getToken);
    await projectsReplicator.startReplication(true, false);
    console.log('[DatabaseManager] Projects replication started');

    const usersReplicator = new HttpReplicator(this.dbInstance, [this.userCollection!], null, null, getToken);
    await usersReplicator.startReplication(true, false);
    console.log('[DatabaseManager] Users replication started');
  }
  
  public getDatabase(): DatabaseInstance | null {
    return this.dbInstance;
  }

  public startProjectsSubscription(): void {
    if (!this.dbInstance || this.projectsSubscription) return;

    this.projectsSubscription = this.dbInstance.projects
      .find()
      .sort({ updatedAt: 'asc' })
      .$.subscribe({
        next: (data: any[]) => {
          const projects = data.map((p: any) => p._data);
          dbEvents.emit('projects:changed', projects);
        },
        error: (err: any) => console.error('[DatabaseManager] Projects subscription error:', err),
      });
  }

  /**
   * Verificar si la base de datos está lista
   */
  public isReady(): boolean {
    return this.dbInstance !== null;
  }

  /**
   * Verificar si está en proceso de inicialización
   */
  public isInitializingDatabase(): boolean {
    return this.isInitializing;
  }

  /**
   * Reset completo de la aplicación
   */
  public async hardAppReset(): Promise<void> {
    this.projectsSubscription?.unsubscribe();
    this.projectsSubscription = null;
    if (this.dbInstance) {
      await this.dbInstance.remove();
    }
    this.dbInstance = null;
    this.initializationPromise = null;
    localStorage.clear();
    window.location.reload();
  }

  /**
   * Hard resync - elimina todas las colecciones excepto projects y users
   */
  public async hardResync(): Promise<void> {
    if (!this.dbInstance) {
      throw new Error('Database not initialized');
    }

    const collectionsToNoDelete = ['projects', 'users'];
    const collections = this.dbInstance.collections;
    const collectionsNames = Object.keys(collections);

    for (const collectionName of collectionsNames) {
      if (!collectionsToNoDelete.includes(collectionName)) {
        await collections[collectionName].find().remove();
      }
    }
  }
}

// Export singleton instance
export const databaseManager = DatabaseManager.getInstance();
