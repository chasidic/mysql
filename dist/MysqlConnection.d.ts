import { Connection } from 'mysql';
export declare type INotify = (response: any, progress: string) => boolean | void;
export declare class MysqlConnection {
    protected _connection: Connection;
    constructor(_connection: Connection);
    generateTs(dir: string): Promise<void>;
    createSchema(name: string): Promise<{}[]>;
    transaction(run: () => Promise<void>): Promise<void>;
    multiQuery<T>(sql: string, insertsArray: any[], chunks?: number, notify?: INotify): Promise<void>;
    logQuery(sql: string, inserts?: any): void;
    query<T>(sql: string, inserts?: any): Promise<T[]>;
}
