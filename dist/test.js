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
let mysql = new MySQL_1.MySQL({
    host: 'localhost',
    user: 'root',
    password: '1234'
});
mysql.run(function (db) {
    return __awaiter(this, void 0, void 0, function* () {
        let campaigns = yield db.query('SELECT * FROM ubimo.campaign LIMIT ?', [5]);
        let users = yield db.query('SELECT * FROM ubimo.users LIMIT ?', [5]);
        console.log(campaigns.map(c => c.id));
        console.log(users.map(u => u.user_name));
    });
});
