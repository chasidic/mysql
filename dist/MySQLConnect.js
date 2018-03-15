"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MysqlConnection_1 = require("./MysqlConnection");
const mysql_1 = require("mysql");
class MySQLConnect extends MysqlConnection_1.MysqlConnection {
    constructor(config, errorCallback) {
        const connection = mysql_1.createConnection(config);
        connection.connect();
        if (errorCallback) {
            connection.on('error', errorCallback);
        }
        super(connection);
    }
    end(callback) {
        this._connection.end(callback);
    }
}
exports.MySQLConnect = MySQLConnect;
