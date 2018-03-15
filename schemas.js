const resolve = require('path').resolve;
const MySQL = require('./dist').MySQL;

const mysql = new MySQL({
    "user": "xuser",
    "password": "xpassword",
    "host": "localhost",
    "database": "xdatabase"
});

mysql.run(async (db) => {
    await db.generateTs(resolve(__dirname, 'generated/'));
});
