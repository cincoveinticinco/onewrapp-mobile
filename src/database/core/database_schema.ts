import { RxDatabase } from 'rxdb';
import {
  pullQueryBuilderFromRxSchema,
  pushQueryBuilderFromRxSchema,
  pullStreamBuilderFromRxSchema,
} from 'rxdb/plugins/replication-graphql';

export default class DatabaseSchema {
    private schemaName: string;

    private schemaInput: any;

    private database!: RxDatabase;

    public batchSize: number;
    
    private migrationStrategies: any;

    constructor(schemaName: string, schemaInput: any, batchSize: number = 50, migrationStrategies: any = {}) {
      this.schemaName = schemaName;
      this.schemaInput = schemaInput;
      this.batchSize = batchSize;
      this.migrationStrategies = migrationStrategies;
    }

    SchemaName() {
      return this.schemaName;
    }

    MigrationStrategies() {
      return this.migrationStrategies
        ? this.migrationStrategies
        : {};
    }

    SchemaInput() {
      return this.schemaInput[this.schemaName];
    }

    Schema() {
      return this.schemaInput[this.schemaName].schema;
    }

    public SetDatabaseInstance(value: RxDatabase) {
      this.database = value;
    }

    getPullQueryBuilder() {
      return pullQueryBuilderFromRxSchema(
        this.schemaName,
        this.SchemaInput(),
      );
    }

    getPushQueryBuilder() {
      return pushQueryBuilderFromRxSchema(
        this.schemaName,
        this.SchemaInput(),
      );
    }

    getPullStreamBuilder() {
      return pullStreamBuilderFromRxSchema(
        this.schemaName,
        this.SchemaInput(),
      );
    }

    getLastId() {
      const query = this.database[this.SchemaName()].findOne({
        selector: {},
        sort: [{ id: 'desc' }],
      });

      return query.exec();
    }

    async addItem(obj: any) {
      const lastItem = await this.getLastId();

      const id = lastItem ? `${Number(lastItem.id) + 1}` : '1';
      const updatedAt = new Date().getTime();

      return this.database[this.SchemaName()].insert({ id, updatedAt, ...obj });
    }

    async getItems(selector = {}) {
      if (!this.database) return [];
      const query = this.database[this.SchemaName()].find({
        selector,
      });

      return query.exec();
    }
}
