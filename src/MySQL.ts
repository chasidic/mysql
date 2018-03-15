import { createConnection, ConnectionConfig } from 'mysql';
import { MysqlConnection } from './MysqlConnection';

export class MySQL {
  private _connection = createConnection(this.config);
  run(asyncFunction: (connection: MysqlConnection) => Promise<void>) {

    const disconnectCallback = () => this._connection.destroy();

    const errorCallback = (err: string) => {
      console.log(err);
      disconnectCallback();
    };

    this._connection.connect(() => {
      const mysqlConnection = new MysqlConnection(this._connection);

      asyncFunction(mysqlConnection)
        .then(disconnectCallback, errorCallback);

    });

    this._connection.on('error', errorCallback);
  }

  constructor(private config: ConnectionConfig) { /* */ }
}
