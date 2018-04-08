let express = require('express');
let router = express.Router();
let funct = require('../libs/function');
let jwt = require("../libs/jwt");
/*********middleware to authenticate******************* */
let authenticate = function(req,res,next){
  if(req.cookies['acc_tkn']){
    next();
  }
  else{
    res.redirect('/login');
  }
}

/******************************************************************/


/*************************login  and register router**********************************/
router.post('/register',async function(req,res,next){
  let data = req.body;
  let response = await funct.insertUser(data);
  res.json(response);

});

router.post('/login',async function(req,res,next){
  let data = req.body;
  let response = await funct.getUser(data);
  if(!response['error']){
    response = jwt.encode(response);
  }

  res.json(response);

});

router.get('/login',function(req,res){
  let data = {};
  data.title = "Login";
  res.render('login',data);

});

/**********************************************************************/


/********************************* GET home page.******************* */
router.get(['/','/home'],authenticate, async (req, res)=> { 
  let access_token = req.cookies['acc_tkn'];
  let user_data = jwt.decode(access_token);
  user_data['title'] = "Home";
  user_data['search_data'] = await funct.getAllSearch(user_data['username']);
  res.render('home', user_data);
});


/**************************location data handler*******************************/


router.post('/saveSearch',async (req,res)=>{ //inserts Searches to database
  let data = req.body;
  let response = await funct.insertSearchData(data);
  res.json(response);
});


router.get('/getSearch',async (req,res)=>{ // fetchs all current searches by a user
  let username = req.query.uname;
  let response = await funct.getSearchData(username);
  res.json(response);
});

router.get('/getAllSearch',async (req,res)=>{ //fetchs all search data by a perticular user
  let username = req.query.uname;
  let response = await funct.getAllSearch(username);
  res.json(response);
});

/*************************logout router***************************************/
router.get('/logout',(req,res)=>{
  if(req.cookies['acc_tkn']){
    res.cookie('acc_tkn',"",{maxAge:-1});
  }
  res.redirect('/home');
});
module.exports = router;
