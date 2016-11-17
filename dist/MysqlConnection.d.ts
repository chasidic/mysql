import { IConnection } from 'mysql';
export declare type INotify = (response: any, progress: string) => boolean | void;
export declare class MysqlConnection {
    private _connection;
    constructor(_connection: IConnection);
    generateTs(dir: string): Promise<void>;
    createSchema(name: string): Promise<{}[]>;
    multiQuery<T>(sql: string, insertsArray: any[], chunks?: number, notify?: INotify): Promise<void>;
    logQuery(sql: string, inserts?: any): void;
    query<T>(sql: string, inserts?: any): Promise<T[]>;
}
