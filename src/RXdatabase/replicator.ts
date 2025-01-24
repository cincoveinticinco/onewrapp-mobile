import { replicateRxCollection } from 'rxdb/plugins/replication';
import environment from '../../environment';
import AppDataBase from './database';

export default class HttpReplicator {
  private database: AppDataBase;

  private collections: any;

  private projectId: (number | null);

  private lastItem: any;

  public replicationStates: any[] = [];

  public getToken: () => Promise<string> = () => new Promise<string>((resolve) => {});

  constructor(database: any, collections: any, projectId: (number | null) = null, lastItem: any = null, getToken: () => Promise<string> = () => new Promise<string>((resolve) => {})) {
    this.database = database;
    this.collections = collections;
    this.projectId = projectId;
    this.lastItem = lastItem;
    this.getToken = getToken;
  }

  public stopReplication() {
    this.replicationStates.forEach((replicationState) => {
      if (replicationState) {
        replicationState.cancel();
      }
    });
    this.replicationStates = [];
  }

  private async setupHttpReplication(collection: any, projectId: (number | null), lastItem: any = null, pull: boolean, push: boolean) {
    const currentTimestamp = new Date().toISOString();
    const { getToken } = this;

    try {
      const replicationConfig: any = {
        collection: this.database[collection.SchemaName() as keyof AppDataBase],
        replicationIdentifier: `my-http-replication-${collection.SchemaName()}`,
      };

      // Configuración del PULL
      if (pull) {
        replicationConfig.pull = {
          async handler(checkpointOrNull: any, batchSize: number) {
            const updatedAt = checkpointOrNull ? checkpointOrNull.updatedAt : '1970-01-01T00:00:00.000Z';
            const token = await getToken();
            const id = checkpointOrNull ? checkpointOrNull.id : 0;
            const lastProjectId = checkpointOrNull?.lastProjectId ? checkpointOrNull?.lastProjectId : null;
            const collectionName = collection.getSchemaName();

            const url = new URL(`${environment.URL_PATH}/${collection.getEndpointPullName()}`);
            url.searchParams.append('updated_at', updatedAt);
            url.searchParams.append('id', id.toString());
            url.searchParams.append('batch_size', batchSize.toString());
            if (collection.SchemaName() !== 'projects') {
              url.searchParams.append('last_project_id', (lastProjectId ? lastProjectId.toString() :  projectId));
            }
            if (projectId) {
              url.searchParams.append('project_id', projectId.toString());
            }
            if (lastItem) {
              url.searchParams.append('last_item_id', lastItem.id.toString());
              url.searchParams.append('last_item_updated_at', lastItem.updatedAt);
            } else {
              url.searchParams.append('last_item_id', '0');
              url.searchParams.append('last_item_updated_at', updatedAt);
            }

            const response = await fetch(url.toString(), {
              headers: {
                owsession: token,
              },
            });

            if (!response.ok) {
              throw new Error(`HTTP error in ${collection.SchemaName()} pull! status: ${response.status}`);
            }

            const data = await response.json();
            return {
              documents: data[collectionName],
              checkpoint: data.checkpoint,
            };
          },
        };
      }

      // Configuración del PUSH
      if (push) {
        replicationConfig.push = {
          async handler(changeRows: any): Promise<any> {
            const token = await getToken();
            const rawResponse = await fetch(`${environment.URL_PATH}/${collection.getEndpointPushName()}`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                owsession: token,
              },
              body: JSON.stringify({ changeRows }),
            });

            if (!rawResponse.ok) {
              throw new Error(`HTTP error in ${collection.SchemaName()} push! status: ${rawResponse.status}`);
            }

            const conflictsArray = await rawResponse.json();
            return conflictsArray;
          },
        };
      }

      const replicationState = replicateRxCollection(replicationConfig);

      // Crear una promesa que se rechazará si hay un error en la replicación
      const errorPromise = new Promise((_, reject) => {
        replicationState.error$.subscribe((err) => {
          reject(new Error(`Replication error in ${collection.SchemaName()}: ${err.message}`));
        });
      });

      // Esperar tanto la replicación inicial como posibles errores
      await Promise.race([
        this.monitorReplicationStatus(replicationState),
        errorPromise
      ]);

      this.replicationStates.push(replicationState);
      return replicationState;

    } catch (error: any) {
      // Cancelar la replicación si existe y hubo un error
      this.stopReplication();
      throw new Error(`Replication failed for ${collection.SchemaName()}: ${error.message}`);
    }
  }

  public async startReplication(pull: boolean = true, push: boolean = true) {
    try {
      const promises = this.collections.map((collection: any) => 
        this.setupHttpReplication(collection, this.projectId, this.lastItem, pull, push)
      );
      await Promise.all(promises);
    } catch (error) {
      this.stopReplication(); // Asegurar que todas las replicaciones se detengan si hay un error
      throw error; // Propagar el error
    }
  }

  public async monitorReplicationStatus(replicationState: any) {
    try {
      await replicationState.awaitInitialReplication();
      return true;
    } catch (error: any) {
      throw new Error(`Initial replication failed: ${error.message}`);
    }
  }

  public resyncReplication() {
    if (this.replicationStates) {
      this.replicationStates.forEach((replicationState) => {
        replicationState.reSync();
      });
    }
  }

  public cancelReplication() {
    this.replicationStates.forEach((replicationState) => {
      replicationState.cancel();
    });
  }

  public removeReplication() {
    this.replicationStates.forEach((replicationState) => {
      replicationState.cancel();
    });
    this.replicationStates = [];
  }
}
