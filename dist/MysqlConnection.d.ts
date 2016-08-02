/// <reference types="bluebird" />
import { IConnection } from 'mysql';
import { IColumn } from './InformationSchema';
export declare class MysqlConnection {
    private _connection;
    constructor(_connection: IConnection);
    infoColumns(): Promise<IColumn[]>;
    createSchema(name: string): Promise<{}[]>;
    multiQuery<T>(sql: string, insertsArray: any[], chunks?: number): Promise<void>;
    logQuery(sql: string, inserts?: any): void;
    query<T>(sql: string, inserts?: any): Promise<T[]>;
}
