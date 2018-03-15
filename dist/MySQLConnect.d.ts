import { MysqlConnection } from './MysqlConnection';
import { ConnectionConfig } from 'mysql';
export declare class MysqlConnect extends MysqlConnection {
    constructor(config: ConnectionConfig, errorCallback?: (err: string) => void);
}
