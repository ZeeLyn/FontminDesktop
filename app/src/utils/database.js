// const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { app } = require("electron");
let sqliteDbPath = path.join(path.dirname(app.getAppPath("exe")), `.db`);
// fs.writeFileSync("d://log.txt", path.dirname(app.getAppPath("exe")));
const db = new sqlite3.Database(sqliteDbPath, function (err) {
    if (err) throw err;
    else {
        db.run('CREATE TABLE if not exists "project" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "title" TEXT(20) NOT NULL, "fontfile" TEXT,"fontfamily" TEXT,"output" TEXT,"types" TEXT);');
    }
});

module.exports = {
    Execute: function (sql, params = []) {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) reject(err);
                else {
                    resolve(this.lastID);
                }
            });
        });
    },
    Query: function Query(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.all(sql, params, function (err, rows) {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
};
