import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { addRxPlugin, createRxDatabase } from 'rxdb';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { wrappedKeyCompressionStorage } from 'rxdb/plugins/key-compression';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { rxdb, RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
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
        multiInstance: false,
        ignoreDuplicate: true 
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
        const existingDbName = 'onewrappdb';
        let dbExists = false;
        
        // Intenta primero con indexedDB.databases()
        try {
          dbExists = (await indexedDB.databases()).some(db => db.name === existingDbName);
        } catch (e) {
          console.warn('Error checking for existing database:', e);
        }
        
        if (dbExists) {
          console.log('Using existing database instance');
          // Asegurarse de que la instancia es válida intentando acceder a alguna colección
          try {
            const dbInstance = await this.dbInstance;
            // Verificar si la instancia es válida
            if (dbInstance && Object.keys(dbInstance.collections)?.length > 0) {
              return dbInstance;
            }
          } catch (accessError) {
            console.warn('Existing database instance is invalid or inaccessible:', accessError);
          }
        }
      } catch (error) {
        console.warn('Error during database existence check:', error);
      }
      
      // Si llegamos aquí, necesitamos crear una nueva instancia
      console.log('Creating new database instance');
      this.dbInstance = this.initializeDatabase();
      return this.dbInstance;
    }
}
