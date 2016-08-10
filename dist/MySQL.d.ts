/// <reference types="bluebird" />
import { IConnectionConfig } from 'mysql';
import { MysqlConnection } from './MysqlConnection';
export declare class MySQL {
    private config;
    private notify;
    private _connection;
    run(asyncFunction: (connection: MysqlConnection) => Promise<void>): void;
    constructor(config: IConnectionConfig, notify: (res: any) => void);
}
