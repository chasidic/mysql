"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const mysql_1 = require("mysql");
const GenerateTypescript_1 = require("./GenerateTypescript");
class MysqlConnection {
    constructor(_connection) {
        this._connection = _connection;
    }
    generateTs(dir) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const columns = yield this.query('SELECT * FROM INFORMATION_SCHEMA.COLUMNS');
            yield GenerateTypescript_1.generateTypescript(columns, dir);
        });
    }
    createSchema(name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.query(`CREATE DATABASE IF NOT EXISTS ??`, [name]);
        });
    }
    multiQuery(sql, insertsArray, chunks = 20, notify = null) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const total = Math.ceil(insertsArray.length / chunks);
            let count = 0;
            for (let i = 0; i < insertsArray.length; i += chunks) {
                let SQL = insertsArray
                    .slice(i, i + chunks)
                    .map(inserts => mysql_1.format(sql, inserts))
                    .join(';\n');
                let response = yield this.query(SQL);
                if (notify != null) {
                    if (notify(response, `${++count}/${total}`)) {
                        break;
                    }
                }
            }
        });
    }
    logQuery(sql, inserts = []) {
        console.log(mysql_1.format(sql, inserts));
    }
    query(sql, inserts = []) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let SQL = mysql_1.format(sql, inserts);
            return new Promise((resolve, reject) => {
                this._connection.query(SQL, (err, results) => {
                    if (err)
                        reject(err);
                    else
                        resolve(results);
                });
            });
        });
    }
}
exports.MysqlConnection = MysqlConnection;
