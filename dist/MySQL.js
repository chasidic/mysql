"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("mysql");
const MysqlConnection_1 = require("./MysqlConnection");
class MySQL {
    constructor(config) {
        this.config = config;
        this._connection = mysql_1.createConnection(this.config);
    }
    run(asyncFunction) {
        const disconnectCallback = () => this._connection.destroy();
        const errorCallback = (err) => {
            console.log(err);
            disconnectCallback();
        };
        this._connection.connect(() => {
            const mysqlConnection = new MysqlConnection_1.MysqlConnection(this._connection);
            asyncFunction(mysqlConnection)
                .then(disconnectCallback, errorCallback);
        });
        this._connection.on('error', errorCallback);
    }
}
exports.MySQL = MySQL;
