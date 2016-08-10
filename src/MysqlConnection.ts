import { IConnection, format } from 'mysql';
import { IColumn } from './InformationSchema';
import { generateTypescript } from './GenerateTypescript';

export type INotify = (res: any) => void;

export class MysqlConnection {
  constructor(private _connection: IConnection, private notify: INotify) { /* */ }

  async generateTs(dir: string) {
    const columns = await this.query<IColumn>('SELECT * FROM INFORMATION_SCHEMA.COLUMNS');
    await generateTypescript(columns, dir);
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

      let response = await this.query<T>(SQL);
      if (this.notify) this.notify(response);
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
