var Helper = require('../../config/helper');
var  Database = require('../../config/database.js');
async = require("async");
var path = require('path');
var db = '';
module.exports = class sponser_illness_model extends Helper{

    constructor(){
        super();
        db = new Database();
    }
   async illness_list(data,callback){
   	try{
        const[row, field] = await db.db_connect.execute('select user_illnesses.id,user_illnesses.illness_id,user_illnesses.user_id,users.username,illnesses.name as illness_name FROM user_illnesses left JOIN users ON users.id=user_illnesses.user_id left JOIN illnesses ON illnesses.id=user_illnesses.illness_id left JOIN policies ON policies.id=user_illnesses.id WHERE user_illnesses.is_deleted = 0 ORDER BY user_illnesses.id DESC ' );
   		
       callback(row);
    }catch(err){        
        throw err;
    }
 }
   }
