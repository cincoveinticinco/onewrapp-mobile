import { addRxPlugin, createRxDatabase } from 'rxdb';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import DatabaseSchema from './database_schema';

addRxPlugin(RxDBDevModePlugin);

export default class AppDataBase {
    private dbName = 'onewrappdb'
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
        const schemaObject: { [key: string]: any } = {}; // Add index signature

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