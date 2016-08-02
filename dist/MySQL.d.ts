/// <reference types="bluebird" />
import { IConnectionConfig } from 'mysql';
import { MysqlConnection } from './MysqlConnection';
export declare class MySQL {
    private config;
    private _ready;
    private _connection;
    readonly ready: Promise<string>;
    run(asyncFunction: (connection: MysqlConnection) => Promise<void>): void;
    constructor(config: IConnectionConfig);
}
