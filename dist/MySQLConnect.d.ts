import { MysqlConnection } from './MysqlConnection';
import { ConnectionConfig } from 'mysql';
export declare class MySQLConnect extends MysqlConnection {
    constructor(config: ConnectionConfig, errorCallback?: (err: string) => void);
}
