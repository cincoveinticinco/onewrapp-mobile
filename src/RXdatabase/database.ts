import { addRxPlugin, createRxDatabase } from "rxdb"
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { RxDBMigrationPlugin } from 'rxdb/plugins/migration-schema';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { DatabaseSchema } from "./database_schema";

export class AppDataBase{

    private _dbName = 'onewrappdb'
    private _dbPassword = ''
    private dbInstence;
    private _schemaList;

    public schemaByName(nameSchema:any){
        return this._schemaList.find( x => x instanceof nameSchema )
    }

    constructor(_schemaList: DatabaseSchema[]){
        this._schemaList = _schemaList

        const storage = wrappedValidateAjvStorage({
            storage: getRxStorageDexie()
        })

        this.dbInstence = createRxDatabase({
            name: this._dbName,
            storage,
            //password: this._dbPassword,
            multiInstance: false,
        });

        this.setCollections();

        addRxPlugin(RxDBMigrationPlugin);

        //TO-DO: Only use in DEV
        addRxPlugin(RxDBDevModePlugin);

        console.log('[DATABASE CREATION]', 'RXDB succsessfully created')
    }


    private async setCollections(){

        const persistentStorage = await this.dbInstence

        const schemaObject:any = {}
        
        this._schemaList.forEach( schema => {
            schemaObject[schema.SchemaName()] = {
                schema: schema.Schema()
            }
        })

        await persistentStorage.addCollections({...schemaObject})
    }

    public getCollections() {
      return this._schemaList
    }

    // private doSync() {
    //     const url_string = window.location.href;
    //     const url = new URL(url_string);
    //     const shouldSync = url.searchParams.get('sync');
    //     if (shouldSync && shouldSync.toLowerCase() === 'false') {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }
}