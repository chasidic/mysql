"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("mysql");
const GenerateTypescript_1 = require("./GenerateTypescript");
class MysqlConnection {
    constructor(_connection) {
        this._connection = _connection;
    }
    async generateTs(dir) {
        const columns = await this.query('SELECT * FROM INFORMATION_SCHEMA.COLUMNS');
        await GenerateTypescript_1.generateTypescript(columns, dir);
    }
    async createSchema(name) {
        return this.query(`CREATE DATABASE IF NOT EXISTS ??`, [name]);
    }
    async transaction(run) {
        return new Promise((resolve, reject) => {
            this._connection.beginTransaction((err) => err ? reject(err) : run().then(() => this._connection.commit(e => e ? reject(e) : resolve()), () => this._connection.rollback(e => e ? reject(e) : resolve())));
        });
    }
    async multiQuery(sql, insertsArray, chunks = 20, notify = null) {
        const total = Math.ceil(insertsArray.length / chunks);
        let count = 0;
        for (let i = 0; i < insertsArray.length; i += chunks) {
            const SQL = insertsArray
                .slice(i, i + chunks)
                .map(inserts => mysql_1.format(sql, inserts))
                .join(';\n');
            const response = await this.query(SQL);
            if (notify != null) {
                if (notify(response, `${++count}/${total}`)) {
                    break;
                }
            }
        }
    }
    logQuery(sql, inserts = []) {
        console.log(mysql_1.format(sql, inserts));
    }
    async query(sql, inserts = []) {
        const SQL = mysql_1.format(sql, inserts);
        return new Promise((resolve, reject) => {
            this._connection.query(SQL, (err, results) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(results);
                }
            });
        });
    }
}
exports.MysqlConnection = MysqlConnection;
