import { MysqlConnection } from './MysqlConnection';
import { createConnection, ConnectionConfig, MysqlError } from 'mysql';

export class MySQLConnect extends MysqlConnection {
    constructor(config: ConnectionConfig, errorCallback?: (err: string) => void) {
        const connection = createConnection(config);
        connection.connect();
        if (errorCallback) {
            connection.on('error', errorCallback);
        }
        super(connection);
    }

    end(callback?: (err: MysqlError, ...args: any[]) => void) {
        this._connection.end(callback);
    }
}
