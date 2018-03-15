import { MysqlConnection } from './MysqlConnection';
import { createConnection, ConnectionConfig } from 'mysql';

export class MySQLConnect extends MysqlConnection {
    constructor(config: ConnectionConfig, errorCallback?: (err: string) => void) {
        const connection = createConnection(config);
        connection.connect();
        if (errorCallback) {
            connection.on('error', errorCallback);
        }
        super(connection);
    }
}
