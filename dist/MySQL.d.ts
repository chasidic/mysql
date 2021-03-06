import { ConnectionConfig } from 'mysql';
import { MysqlConnection } from './MysqlConnection';
export declare class MySQL {
    private config;
    private _connection;
    run(asyncFunction: (connection: MysqlConnection) => Promise<void>): void;
    constructor(config: ConnectionConfig);
}
