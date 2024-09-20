import { replicateRxCollection } from 'rxdb/plugins/replication';
import { RxDatabase } from 'rxdb';
import environment from '../../environment';
import AppDataBase from './database';

export default class HttpReplicator {
  private database: AppDataBase;

  private collections: any;

  private projectId: (number | null);

  private lastItem: any;

  private replicationStates: any[] = [];

  public getToken: () => Promise<string> = () => new Promise<string>((resolve) => {})

  constructor(database: any, collections: any, projectId: (number | null) = null, lastItem: any = null, getToken: () => Promise<string> = () => new Promise<string>((resolve) => {})) {
    this.database = database;
    this.collections = collections;
    this.projectId = projectId;
    this.lastItem = lastItem;
    this.getToken = getToken;
  }

  public async startReplicationPull() {
    const { collections } = this;
    const promises = collections.map((collection: any) => this.setupHttpReplicationPull(collection, this.projectId, this.lastItem));
    await Promise.all(promises); // Espera a que todas las replicaciones de pull se hayan iniciado
  }

  public async startReplicationPush() {
    const { collections } = this;
    const promises = collections.map((collection: any) => this.setupHttpReplicationPush(collection));
    await Promise.all(promises); // Espera a que todas las replicaciones de push se hayan iniciado
  }

  public stopReplication() {
    this.replicationStates.forEach((replicationState) => {
      if (replicationState) {
        replicationState.cancel();
      }
    });
    this.replicationStates = [];
  }

  private async setupHttpReplicationPull(collection: any, projectId: (number | null), lastItem: any = null) {
    const currentTimestamp = new Date().toISOString();
    const { getToken } = this;
    console.log('Setting up replication PULL for', collection.SchemaName(), currentTimestamp);
  
    try {
      const replicationState = replicateRxCollection({
        collection: this.database[collection.SchemaName() as keyof AppDataBase],
        replicationIdentifier: 'my-http-replication',
        pull: {
          async handler(checkpointOrNull: any, batchSize: number) {
            try {
              const updatedAt = checkpointOrNull ? checkpointOrNull.updatedAt : '1970-01-01T00:00:00.000Z';
              const token = await getToken();
              const id = checkpointOrNull ? checkpointOrNull.id : 0;
              const lastProjectId = checkpointOrNull ? checkpointOrNull.lastProjectId : 0;
              const collectionName = collection.getSchemaName();
              
              const url = new URL(`${environment.URL_PATH}/${collection.getEndpointPullName()}`);
              url.searchParams.append('updated_at', updatedAt);
              url.searchParams.append('id', id.toString());
              url.searchParams.append('batch_size', batchSize.toString());
              if (collection.SchemaName() !== 'projects') {
                url.searchParams.append('last_project_id', lastProjectId.toString());
              }
              if (projectId) {
                url.searchParams.append('project_id', projectId.toString());
              }
              if (lastItem) {
                url.searchParams.append('last_item_id', lastItem.id.toString());
                url.searchParams.append('last_item_updated_at', lastItem.updatedAt);
              }
  
              const response = await fetch(url.toString(), {
                headers: {
                  owsession: token,
                },
              });
  
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
  
              const data = await response.json();
              return {
                documents: data[collectionName],
                checkpoint: data.checkpoint,
              };
            } catch (error) {
              console.error(`Error in pull handler for ${collection.SchemaName()}:`, error);
              throw error;
            }
          },
        },
      });
  
      replicationState.error$.subscribe((err) => {
        console.error(`Replication error in ${collection.SchemaName()}:`, err);
      });
  
      await this.monitorReplicationStatus(replicationState);
  
      this.replicationStates.push(replicationState);
    } catch (error) {
      console.error(`Error setting up replication PULL for ${collection.SchemaName()}:`, error);
      throw error;
    }
  }
  
  private async setupHttpReplicationPush(collection: any) {
    const currentTimestamp = new Date().toISOString();
    const { getToken } = this;
    console.log('Setting up replication PUSH for', collection.SchemaName(), currentTimestamp);
  
    try {
      const replicationState = replicateRxCollection({
        collection: this.database[collection.SchemaName() as keyof AppDataBase],
        replicationIdentifier: 'my-http-replication',
        push: {
          async handler(changeRows: any): Promise<any> {
            try {
              const token = await getToken();
              const rawResponse = await fetch(`${environment.URL_PATH}/${collection.getEndpointPushName()}`, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  owsession: token,
                },
                body: JSON.stringify(changeRows),
              });
  
              if (!rawResponse.ok) {
                throw new Error(`HTTP error! status: ${rawResponse.status}`);
              }
  
              const conflictsArray = await rawResponse.json();
              return conflictsArray;
            } catch (error) {
              console.error(`Error in push handler for ${collection.SchemaName()}:`, error);
              throw error;
            }
          },
        },
      });
  
      replicationState.error$.subscribe((err) => {
        console.error(`Replication error in ${collection.SchemaName()}:`, err);
      });
  
      this.replicationStates.push(replicationState);
    } catch (error) {
      console.error(`Error setting up replication PUSH for ${collection.SchemaName()}:`, error);
      throw error;
    }
  }

  public monitorReplicationStatus(replicationState: any) {
    return replicationState.awaitInitialReplication().then(() => true);
  }

  public resyncReplication() {
    if(this.replicationStates) {
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
