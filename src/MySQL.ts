import { createConnection, IConnectionConfig } from 'mysql';
import { MysqlConnection } from './MysqlConnection';

export class MySQL {
  private _ready: Promise<string>;
  private _connection = createConnection(this.config);

  get ready() { return this._ready; }

  run(asyncFunction: (connection: MysqlConnection) => Promise<void>) {

    let disconnectCallback = () => this._connection.destroy();

    let errorCallback = (err: string) => {
      console.log(err);
      disconnectCallback();
    };

    this._connection.connect(() => {
      let mysqlConnection = new MysqlConnection(this._connection);

      asyncFunction(mysqlConnection)
        .then(disconnectCallback, errorCallback);

    });

    this._connection.on('error', errorCallback);
  }

  constructor(private config: IConnectionConfig) { /* */ }
}
