import { replicateGraphQL } from 'rxdb/plugins/replication-graphql';
import AppDataBase from './database';

export default class GraphQLReplicator {
  private database: AppDataBase;

  private syncURL = {
    http: `${process.env.URL_PATH}:${process.env.GRAPHQL_PORT}/${process.env.GRAPHQL_PATH}`,
  }

  private replicationStates: any[] = [];

  constructor(database: AppDataBase) {
    this.database = database;

    this.startReplication();
  }

  public startReplication() {
    const collections = this.database.getCollections();

    collections.forEach((collection) => this.setupGraphQLReplication(collection));
  }

  public stopReplication() {
    this.replicationStates.forEach((replicationState) => {
      if (replicationState) {
        replicationState.cancel();
      }
    });
    this.replicationStates = [];
  }

  private setupGraphQLReplication(collection: any) {
    const replicationState = replicateGraphQL({
      collection,
      url: this.syncURL,
      pull: {
        queryBuilder: collection.schema.getPullQueryBuilder(),
        batchSize: collection.schema.batchSize,
      },
      push: {
        queryBuilder: collection.schema.getPushQueryBuilder(),
        batchSize: collection.schema.batchSize,
      },
      deletedField: 'deleted',
      live: true,
      replicationIdentifier: `replication-${collection.name}`,
    });

    replicationState.error$.subscribe((err) => {
      console.error(`Replication error in ${collection.name}:`);
      console.dir(err);
    });

    return replicationState;
  }
}
