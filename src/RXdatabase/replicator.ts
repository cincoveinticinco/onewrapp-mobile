import { replicateRxCollection } from 'rxdb/plugins/replication';
import { Subject } from 'rxjs';
import { RxDatabase } from 'rxdb';
import environment from '../../environment';
import AppDataBase from './database';

// const myPullStream$: any = new Subject();
// const eventSource = new EventSource('http://localhost:3000/owapp/pull_stream_scenes', { withCredentials: true });
// eventSource.onmessage = event => {
//   const eventData = JSON.parse(event.data);
//   myPullStream$.next({
//     documents: eventData.documents,
//     checkpoint: eventData.checkpoint
//   });
//   console.log(eventData);
// };

// console.log(eventSource);
// eventSource.addEventListener('data', (event) => {
//   console.log('data', event);
// });

export default class HttpReplicator {
  private database: AppDataBase;

  private collections: any;

  private projectId: (number | null);

  private lastItem: any;

  private replicationStates: any[] = [];

  public getToken: () => Promise<string> = () => new Promise<string>((resolve) => {})

  constructor(database:any, collections: any, projectId: (number | null) = null, lastItem: any = null, getToken: () => Promise<string> = () => new Promise<string>((resolve) => {})) {
    this.database = database;
    this.collections = collections;
    this.projectId = projectId;
    this.lastItem = lastItem;
    this.getToken = getToken;
  }

  public startReplicationPull() {
    const { collections } = this;

    collections.forEach((collection: any) => this.setupHttpReplicationPull(collection, this.projectId, this.lastItem));
  }

  public startReplicationPush() {
    const { collections } = this;

    collections.forEach((collection: any) => this.setupHttpReplicationPush(collection));
  }

  public stopReplication() {
    this.replicationStates.forEach((replicationState) => {
      if (replicationState) {
        replicationState.cancel();
      }
    });
    this.replicationStates = [];
  }

  private setupHttpReplicationPull(collection: any, projectId: (number | null), lastItem: any = null) {
    const currentTimestamp = new Date().toISOString();
    const { getToken } = this;
    console.log('Setting up replication PULL for', collection.SchemaName(), currentTimestamp);
    const replicationState = replicateRxCollection({
      collection: this.database[collection.SchemaName() as keyof AppDataBase],
      replicationIdentifier: 'my-http-replication',
      pull: {
        async handler(checkpointOrNull: any, batchSize: number) {
          const updatedAt = checkpointOrNull ? checkpointOrNull.updatedAt : '1970-01-01T00:00:00.000Z';
          const token = await getToken();
          const id = checkpointOrNull ? checkpointOrNull.id : 0;
          const lastProjectId = checkpointOrNull ? checkpointOrNull.lastProjectId : 0;
          const collectionName = collection.getSchemaName();
          const response = await fetch(`${environment.URL_PATH}/${collection.getEndpointPullName()}?updated_at=${updatedAt}&id=${id}&batch_size=${batchSize}${collection.SchemaName() !== 'projects' ? `&last_project_id=${lastProjectId}` : ''}${projectId ? `&project_id=${projectId}` : ''}${lastItem ? `&last_item_id=${lastItem.id}&last_item_updated_at=${lastItem.updatedAt}` : ''}`, {
            headers: {
              owsession: token,
            },
          });
          const data = await response.json();
          return {
            documents: data[collectionName],
            checkpoint: data.checkpoint,
          };
        },
      },
    });

    replicationState.error$.subscribe((err) => {
      console.error(`Replication error in ${collection.SchemaName()}:`);
      console.dir(err);
    });

    this.replicationStates.push(replicationState);
  }

  private setupHttpReplicationPush(collection: any) {
    const currentTimestamp = new Date().toISOString();
    const { getToken } = this;
    console.log('Setting up replication  PUSH for', collection.SchemaName(), currentTimestamp);
    const replicationState = replicateRxCollection({
      collection: this.database[collection.SchemaName() as keyof AppDataBase],
      replicationIdentifier: 'my-http-replication',
      push: {
        async handler(changeRows: any): Promise<any> {
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
          const conflictsArray = await rawResponse.json();
          return conflictsArray;
        },

      },
    });

    replicationState.error$.subscribe((err) => {
      console.error(`Replication error in ${collection.SchemaName()}:`);
      console.dir(err);
    });

    this.replicationStates.push(replicationState);

    return replicationState;
  }

  public monitorReplicationStatus() {
    return this.replicationStates[0].awaitInitialReplication().then(() => true);
  }

  public resyncReplication() {
    this.replicationStates.forEach((replicationState) => {
      replicationState.run();
    });
  }
}
