//basic functionalities of the app

const jwt = require('./jwt');
let Sqlite = require('./sqliteOrm');

class Function{
    async insertUser(data){
       try{

            let email = data.email;
            let username = data.username;
            let fname = data.firstname;
            let lname = data.lastname;
            let pass = data.passwd;
            let userQuery = "SELECT username from users where username=?";
            let user_data = await Sqlite.getData(userQuery,[username]);
            if(user_data && user_data['username'] && user_data['username']!=""){
                return {"error":"Username name already exists!!"};
            }
            else{
                let user_data2 = await Sqlite.getData("SELECT email from users WHERE email=?",[email]);
                if(user_data2 && user_data2['email'] && user_data2['email']!=""){
                    return {"error":"email id already exists!!"};
                }
                else{
                    let insertQuery = "INSERT into users(username,email,firstname,lastname,password) VALUES(?,?,?,?,?)";
                    let response = await Sqlite.insert(insertQuery,[username,email,fname,lname,pass]);
                    if(response['status'] == "inserted"){
                        return {"success":"user registered successfully!"};
                    }
                    else{
                        return {"error":"problem while registering user!!"};
                    }
                }
            }
       } catch(error){
           console.log(error);
       }


    }

    async getUser(data){
        let username = data.username;
        let password = data.password;
        let getUserQuery = "SELECT * from users WHERE username=? AND password=?";
        let getUserQuery2 = "SELECT username,email,firstname,lastname from users WHERE email=? AND password=?";
        try{
            let userRes1 = await Sqlite.getData(getUserQuery,[username,password]);
            if(userRes1){
                return userRes1;
            }
            else{
                let userRes2 = await Sqlite.getData(getUserQuery2,[username,password]);
                if(userRes2){
                    return userRes2;
                }else{
                    return {error:"invalid credential!!"};
                }
            }
        }catch(err){
            console.log(err);
        }

    }

    async insertSearchData(data){
        let name = data.name;
        let address = data.address;
        let type = data.type;
        let lat = data.latitude;
        let lng = data.longitude;
        let place_id = data.placeId;
        let usn = data.uname;
        let new_flag = 1;
        let search_date = data.search_date;
        let insertSearchQuery = "INSERT into searches(username,search_name,address,type,latitude,longitude,place_id,new_flag,search_date) VALUES(?,?,?,?,?,?,?,?,?)";
        try{
            let userRes2 = await Sqlite.insert(insertSearchQuery,[usn,name,address,type,lat,lng,place_id,new_flag,search_date]);

            if(userRes2 && userRes2['status'] && userRes2['status'] == "inserted"){
                return {success:"inserted"};
            }else{
                return {err:"error while inserting"};
            }
        }catch(err){
            console.log(err);
        }


    }

    async getSearchData(username){
        try{

            let getQuery = "SELECT search_name,address,type,latitude,longitude,place_id,search_date from searches where username=? and new_flag=1";
            let getCountQuery = "SELECT COUNT(search_name) as count from searches where username=? and new_flag=1";
            let count = await Sqlite.getData(getCountQuery,[username]);
            console.log(count);
            if(count && count['count']){
                let response = await Sqlite.getResult(getQuery,[username],count['count']);
                if(response){
                    let updateQuery = "Update searches SET new_flag=0 WHERE username=? AND new_flag=1";
                    let new_flag_updated = await Sqlite.update(updateQuery,[username]);
                    console.log(new_flag_updated);
                    return response;
                }
                else{
                    return {err:"no data found"};
                }

            }else{
                return {err:"no data found"};
            }



        }catch(err){
            console.log(err);
        }


    }

    async getAllSearch(username){
        try{
            let sq =  "SELECT search_name,address,type,latitude,longitude,place_id,search_date from searches where username=?";
            let cq = "SELECT COUNT(username) as count from searches where username=?";
            let count = await Sqlite.getData(cq,[username]);
            if(count && count['count']){
                let response = await Sqlite.getResult(sq,[username],count['count']);
                if(response){
                    return response;
                }else{
                    return {err:"no data found"};
                }
            }else{
                return {err:"no data found"};
            }
        }catch(err){
            console.log(err);
        }
    }
}

module.exports = new Function();
