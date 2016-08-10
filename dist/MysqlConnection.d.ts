/// <reference types="bluebird" />
import { IConnection } from 'mysql';
export declare class MysqlConnection {
    private _connection;
    private notify;
    constructor(_connection: IConnection, notify?: (res: any) => void);
    generateTs(dir: string): Promise<void>;
    createSchema(name: string): Promise<{}[]>;
    multiQuery<T>(sql: string, insertsArray: any[], chunks?: number): Promise<void>;
    logQuery(sql: string, inserts?: any): void;
    query<T>(sql: string, inserts?: any): Promise<T[]>;
}
