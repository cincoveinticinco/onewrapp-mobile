import { replicateRxCollection } from 'rxdb/plugins/replication';
import { Subject } from 'rxjs';
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

  private replicationStates: any[] = [];

  constructor(database: AppDataBase, collections: any, projectId: (number | null) = null) {
    this.database = database;
    this.collections = collections;
    this.projectId = projectId;
  }

  public startReplicationPull() {
    const { collections } = this;

    collections.forEach((collection: any) => this.setupHttpReplicationPull(collection, this.projectId));
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

  private setupHttpReplicationPull(collection: any, projectId: (number | null)) {
    const currentTimestamp = new Date().toISOString();
    console.log('Setting up replication PULL for', collection.SchemaName(), currentTimestamp);
    const replicationState = replicateRxCollection({
      collection: this.database[collection.SchemaName() as keyof AppDataBase],
      replicationIdentifier: 'my-http-replication',
      pull: {
        async handler(checkpointOrNull: any, batchSize: number) {
          const updatedAt = checkpointOrNull ? checkpointOrNull.updatedAt : '1970-01-01T00:00:00.000Z';
          const id = checkpointOrNull ? checkpointOrNull.id : 0;
          const lastProjectId = checkpointOrNull ? checkpointOrNull.lastProjectId : 0;
          const collectionName = collection.getSchemaName();
          const response = await fetch(`${environment.URL_PATH}/${collection.getEndpointPullName()}?updated_at=${updatedAt}&id=${id}&batch_size=${batchSize}${collection.SchemaName() === 'scenes' ? `&last_project_id=${lastProjectId}` : ''}${projectId ? `&project_id=${projectId}` : ''}`);
          const data = await response.json();
          return {
            documents: data[collectionName],
            checkpoint: data.checkpoint,
          };
        },
        // stream$: myPullStream$.asObservable(),
      },
    });

    replicationState.error$.subscribe((err) => {
      console.error(`Replication error in ${collection.SchemaName()}:`);
      console.dir(err);
    });

    this.replicationStates.push(replicationState);

    return replicationState;
  }

  private setupHttpReplicationPush(collection: any) {
    const currentTimestamp = new Date().toISOString();
    console.log('Setting up replication  PUSH for', collection.SchemaName(), currentTimestamp);
    const replicationState = replicateRxCollection({
      collection: this.database[collection.SchemaName() as keyof AppDataBase],
      replicationIdentifier: 'my-http-replication',
      push: {
        async handler(changeRows: any): Promise<any> {
          const rawResponse = await fetch(`${environment.URL_PATH}/${collection.getEndpointPushName()}`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
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
}
