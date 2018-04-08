
//library for handling Sqlite functionalities

const sqlite3 = require('sqlite3').verbose();
const path = require('path');


class Sqlite {
    constructor(){

        this.dbPath = path.resolve(__dirname,'../data/app.db');
        let database = this.dbPath;
        this.db = new sqlite3.Database(database, async (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the database.');

        });

    }

    async  getData(sql,params) {
        return new Promise((resolve,reject)=>{
            this.db.get(sql,params,(err,row)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve(row);
                }
            });
        });
    }

    async getResult(sql,params,count){
        let data = [];
        let i = 0;
        return new Promise((resolve,reject)=>{
            this.db.each(sql,params,(err,row)=>{
                if(err){
                    reject(err);
                }else{

                    data.push(row);
                    if(i == count-1){
                        resolve(data);
                    }
                    i++;
                }
            });
        })
    }

    async  insert(sql,params) {
        return new Promise((resolve,reject)=>{
            this.db.run(sql,params,(err)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve({status:"inserted"});
                }
            });
        });
    }

    async createTable(tablename,params){
        let sql = "CREATE TABLE IF NOT EXISTS "+tablename+"(";
        for(var key in params){
            sql+=key+" "+params[key]+","
        }
        sql = sql.slice(0, -1)+")";
        let db = this.db;
        return new Promise((resolve ,reject)=> {
            db.serialize(function () {
               db.run(sql, function (err) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve({status: "created table:" + tablename});
                    }
                });
            });
        });
    }

    async update(sql,params){
        return new Promise((resolve,reject)=>{
            this.db.run(sql,params,(err)=>{
                if(err){
                    reject(err);
                }
                else{
                    resolve({status:"updated"});
                }
            });
        });
    }
}

module.exports = new Sqlite();
