import { addRxPlugin, createRxDatabase } from 'rxdb';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import DatabaseSchema from './database_schema';

export default class AppDataBase {
    private dbName = 'onewrappdb'

    private dbPassword = ''

    private dbInstence;

    private schemaList;

    public schemaByName(nameSchema:any) {
      return this.schemaList.find((x) => x instanceof nameSchema);
    }

    constructor(schemaList: DatabaseSchema[]) {
      this.schemaList = schemaList;

      const storage = wrappedValidateAjvStorage({
        storage: getRxStorageDexie(),
      });

      this.dbInstence = createRxDatabase({
        name: this.dbName,
        storage,
        // password: this.dbPassword,
        multiInstance: false,
      });

      this.setCollections();

      addRxPlugin(RxDBMigrationPlugin);

      // TO-DO: Only use in DEV
      addRxPlugin(RxDBDevModePlugin);
    }

    private async setCollections() {
      const persistentStorage = await this.dbInstence;

      const schemaObject:any = {};

      this.schemaList.forEach((schema) => {
        schemaObject[schema.SchemaName()] = {
          schema: schema.Schema(),
        };
      });

      await persistentStorage.addCollections({ ...schemaObject });
    }

    public getCollections() {
      return this.schemaList;
    }

  // private doSync() {
  //     const urlstring = window.location.href;
  //     const url = new URL(urlstring);
  //     const shouldSync = url.searchParams.get('sync');
  //     if (shouldSync && shouldSync.toLowerCase() === 'false') {
  //         return false;
  //     } else {
  //         return true;
  //     }
  // }
}
