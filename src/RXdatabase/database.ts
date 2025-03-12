import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBMigrationSchemaPlugin } from 'rxdb/plugins/migration-schema';
import DatabaseSchema from './database_schema';

addRxPlugin(RxDBDevModePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBMigrationSchemaPlugin);
addRxPlugin(RxDBMigrationPlugin);

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
        storage: wrappedKeyCompressionStorage({
          storage: getRxStorageDexie(),
        }),
      });

      const dbInstance = await createRxDatabase({
        name: this.dbName,
        storage,
        multiInstance: false
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
          migrationStrategies: {
            ...schema.MigrationStrategies()
          }
        };
      });

      await persistentStorage.addCollections({ ...schemaObject });
    }

    public async getDatabaseInstance() {
      try {
        // Check if database already exists in IndexedDB
        const existingDb = await this.dbInstance;
        if (existingDb) {
          return existingDb;
        }
      } catch (error) {
        console.warn('Failed to get existing database, creating new instance', error);
      }
      
      // Create a new instance only if needed
      this.dbInstance = this.initializeDatabase();
      return this.dbInstance;
    }
}
