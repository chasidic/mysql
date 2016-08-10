import { IConnection, format } from 'mysql';
import { IColumn } from './InformationSchema';
import { generateTypescript } from './GenerateTypescript';

export type INotify = (response: any, progress: string) => boolean | void;

export class MysqlConnection {
  constructor(private _connection: IConnection) { /* */ }

  async generateTs(dir: string) {
    const columns = await this.query<IColumn>('SELECT * FROM INFORMATION_SCHEMA.COLUMNS');
    await generateTypescript(columns, dir);
  }

  async createSchema(name: string) {
    return this.query(`CREATE DATABASE IF NOT EXISTS ??`, [ name ]);
  }

  async multiQuery<T>(sql: string, insertsArray: any[], chunks = 20, notify: INotify = null) {
    const total = Math.ceil(insertsArray.length / chunks);
    let count = 0;
    for (let i = 0; i < insertsArray.length; i += chunks) {
      let SQL = insertsArray
        .slice(i, i + chunks)
        .map(inserts => format(sql, inserts))
        .join(';\n');

      let response = await this.query<T>(SQL);
      if (notify != null) {
        if (notify(response, `${ ++count }/${ total }`)) {
          break;
        }
      }
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
