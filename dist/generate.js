"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const MySQL_1 = require('./MySQL');
const GenerateTypescript_1 = require('./GenerateTypescript');
let mysql = new MySQL_1.MySQL({
    host: 'mysql.ubimo.com',
    user: process.env['_UBIMO_USER'],
    password: process.env['_UBIMO_PASS'],
    database: 'ubimo',
    multipleStatements: true
});
mysql.run(function (db) {
    return __awaiter(this, void 0, void 0, function* () {
        let columns = yield db.infoColumns();
        GenerateTypescript_1.generateTypescript(columns, '../generated');
    });
});
