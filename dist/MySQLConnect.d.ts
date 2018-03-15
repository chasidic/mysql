import { MysqlConnection } from './MysqlConnection';
import { ConnectionConfig, MysqlError } from 'mysql';
export declare class MySQLConnect extends MysqlConnection {
    constructor(config: ConnectionConfig, errorCallback?: (err: string) => void);
    end(callback?: (err: MysqlError, ...args: any[]) => void): void;
}
