import { RxDatabase } from 'rxdb';
import { pullQueryBuilderFromRxSchema, pushQueryBuilderFromRxSchema, pullStreamBuilderFromRxSchema } from 'rxdb/plugins/replication-graphql';

export class DatabaseSchema {
    private _schemaName: string;

    private _schemaInput: any;

    private _database!: RxDatabase;

    public batchSize: number;

    constructor(schemaName: string, schemaInput: any, batchSize: number = 50) {
      this._schemaName = schemaName;
      this._schemaInput = schemaInput;
      this.batchSize = batchSize;
    }

    SchemaName() {
      return this._schemaName;
    }

    SchemaInput() {
      return this._schemaInput[this._schemaName];
    }

    Schema() {
      return this._schemaInput[this._schemaName].schema;
    }

    public SetDatabaseInstance(value: RxDatabase) {
      this._database = value;
    }

    getPullQueryBuilder() {
      return pullQueryBuilderFromRxSchema(
        this._schemaName,
        this.SchemaInput(),
      );
    }

    getPushQueryBuilder() {
      return pushQueryBuilderFromRxSchema(
        this._schemaName,
        this.SchemaInput(),
      );
    }

    getPullStreamBuilder() {
      return pullStreamBuilderFromRxSchema(
        this._schemaName,
        this.SchemaInput(),
      );
    }

    getLastId() {
      const query = this._database[this.SchemaName()].findOne({
        selector: {},
        sort: [{ id: 'desc' }],
      });

      return query.exec();
    }

    async addItem(obj: any) {
      const lastItem = await this.getLastId();

      const id = lastItem ? `${Number(lastItem.id) + 1}` : '1';
      const updatedAt = new Date().getTime();

      return this._database[this.SchemaName()].insert({ id, updatedAt, ...obj });
    }

    async getItems(selector = {}) {
      if (!this._database) return [];
      const query = this._database[this.SchemaName()].find({
        selector,
      });

      return query.exec();
    }
}
