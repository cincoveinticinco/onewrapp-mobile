import { addRxPlugin, createRxDatabase } from 'rxdb';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import DatabaseSchema from './database_schema';

addRxPlugin(RxDBMigrationPlugin);
addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBLeaderElectionPlugin);

export default class AppDataBase {
    private dbName = 'onewrappdb'

    private dbPassword = ''

    private dbInstance: Promise<any>;

    private schemaList;

    constructor(schemaList: DatabaseSchema[]) {
      this.schemaList = schemaList;

      this.dbInstance = this.initializeDatabase();
    }

    private async initializeDatabase() {
      const storage = wrappedValidateAjvStorage({
        storage: getRxStorageDexie(),
      });

      const dbInstance = await createRxDatabase({
        name: this.dbName,
        storage,
        multiInstance: false,
      });

      await this.setCollections(dbInstance);

      return dbInstance;
    }

    private async setCollections(database: any) {
      const persistentStorage = await database;

      const schemaObject:any = {};

      this.schemaList.forEach((schema) => {
        schemaObject[schema.SchemaName()] = {
          schema: schema.Schema(),
        };
      });

      await persistentStorage.addCollections({ ...schemaObject });
    }

    public async getDatabaseInstance() {
      return this.dbInstance;
    }

    public getCollections() {
      return this.schemaList;
    }
}
