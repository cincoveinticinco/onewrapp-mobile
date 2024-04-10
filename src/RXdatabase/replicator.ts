import environment from '../../environment';
import AppDataBase from './database';
import { replicateRxCollection } from 'rxdb/plugins/replication';

export default class GraphQLReplicator {
  private database: AppDataBase;
  private collections: any;
  private projectId: number;

  private replicationStates: any[] = [];

  constructor(database: AppDataBase, collections: any, projectId: number) {
    this.database = database;
    this.collections = collections;
    this.projectId = projectId;
  }

  public startReplication() {
    const collections = this.collections;

    collections.forEach((collection: any) => this.setupGraphQLReplication(collection, this.projectId));
  }

  public stopReplication() {
    this.replicationStates.forEach((replicationState) => {
      if (replicationState) {
        replicationState.cancel();
      }
    });
    this.replicationStates = [];
  }

  private setupGraphQLReplication(collection: any, projectId: number) {
    console.log(this.replicationStates, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    console.log('Setting up replication for', collection.SchemaName());
    const replicationState = replicateRxCollection({
      collection: this.database[collection.SchemaName() as keyof AppDataBase],
      replicationIdentifier: 'my-http-replication',
      pull: {
        async handler(checkpointOrNull: any, batchSize: number) {
          const updatedAt = checkpointOrNull ? checkpointOrNull.updatedAt : "1970-01-01T00:00:00.000Z";
          const id = checkpointOrNull ? checkpointOrNull.id : 0;
          const collectionName = collection.getSchemaName()
          const response = await fetch(`${environment.URL_PATH}/${collection.getEndpointName()}?updated_at=${updatedAt}&id=${id}&batch_size=${batchSize}`);
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

    return replicationState;
  }
}
