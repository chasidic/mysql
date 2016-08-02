import { IConnection, format } from 'mysql';
import { IColumn } from './InformationSchema';

export class MysqlConnection {
  constructor(private _connection: IConnection) { /* */ }

  async infoColumns() {
    return this.query<IColumn>('SELECT * FROM INFORMATION_SCHEMA.COLUMNS');
  }

  async createSchema(name: string) {
    return this.query(`CREATE DATABASE IF NOT EXISTS ??`, [ name ]);
  }

  async multiQuery<T>(sql: string, insertsArray: any[], chunks = 20) {
    for (let i = 0; i < insertsArray.length; i += chunks) {
      let SQL = insertsArray
        .slice(i, i + chunks)
        .map(inserts => format(sql, inserts))
        .join(';\n');

      await this.query<T>(SQL);
    }
  }

  logQuery(sql: string, inserts: any = []) {
    console.log(format(sql, inserts));
  }

  async query<T>(sql: string, inserts: any = []) {
    let SQL = format(sql, inserts);
    return new Promise<T[]>((resolve, reject) => {
      this._connection.query(SQL, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });
  }
}
