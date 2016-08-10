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
const GenerateTypescript_1 = require('./GenerateTypescript');
class MysqlConnection {
    constructor(_connection, notify = null) {
        this._connection = _connection;
        this.notify = notify;
    }
    generateTs(dir) {
        return __awaiter(this, void 0, void 0, function* () {
            const columns = yield this.query('SELECT * FROM INFORMATION_SCHEMA.COLUMNS');
            yield GenerateTypescript_1.generateTypescript(columns, dir);
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
                let response = yield this.query(SQL);
                if (this.notify)
                    this.notify(response);
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
