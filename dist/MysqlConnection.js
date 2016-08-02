"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const mysql_1 = require('mysql');
class MysqlConnection {
    constructor(_connection) {
        this._connection = _connection;
    }
    infoColumns() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query('SELECT * FROM INFORMATION_SCHEMA.COLUMNS');
        });
    }
    createSchema(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query(`CREATE DATABASE IF NOT EXISTS ??`, [name]);
        });
    }
    multiQuery(sql, insertsArray, chunks = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < insertsArray.length; i += chunks) {
                let SQL = insertsArray
                    .slice(i, i + chunks)
                    .map(inserts => mysql_1.format(sql, inserts))
                    .join(';\n');
                yield this.query(SQL);
            }
        });
    }
    logQuery(sql, inserts = []) {
        console.log(mysql_1.format(sql, inserts));
    }
    query(sql, inserts = []) {
        return __awaiter(this, void 0, void 0, function* () {
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
