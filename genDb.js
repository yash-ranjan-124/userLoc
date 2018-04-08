let fs = require('fs');
let path = require('path');
let shellfs = require('shelljs');
let Sqlite = require('./libs/sqliteOrm');

async function createTableUsers() {

    try{
        let response= await Sqlite.createTable('users',{
            username:"TEXT PRIMARY KEY",
            email:"TEXT UNIQUE",
            firstname:"TEXT",
            lastname:"TEXT",
            password:"TEXT",

        });
        return response;
    }
    catch (err){
     console.log(err);
     return err;
    }

}
let createTableSearchs = async function(){

  try{
      let  response= await Sqlite.createTable('searches',{
          username:"TEXT NOT NULL",
          search_name:"TEXT NOT NULL UNIQUE",
          address:"TEXT",
          type:"TEXT",
          latitude:"TEXT",
          longitude:"TEXT",
          place_id:"TEXT",
          new_flag:"INT NOT NULL",
          search_date:"TEXT"
      });
      return response;
  }
  catch (err){
   console.log(err);
   return err;
  }
}
let executeProcess = async function(){
  try{
    let response = await createTableUsers();
    console.log(response);
    let response2 = await createTableSearchs();
    console.log(response2);

  }catch(err){
    console.log(err);
  }


}();
