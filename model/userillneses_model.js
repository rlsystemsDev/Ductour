var Helper = require('../config/helper');
var  Database = require('../config/database.js');
var path = require('path');
async = require("async");
var db = '';
var Promise = require('promise');


module.exports = class userillneses_model extends Helper{

    constructor(){
        super();
        db = new Database();
    }
    async get_userillneses(is_deleted,callback){
    //let is_deleted=0;
    try{
        //var ql='SELECT appointments.*,users.`username` FROM `appointments` LEFT JOIN users on appointments.user_id = users.id' 
        const[row, field] = await db.db_connect.execute('SELECT user_illnesses.illness_id,user_illnesses.status,users.`username` FROM `user_illnesses` JOIN users on user_illnesses.user_id = users.id' );
        console.log(row);// return false;
        callback(row);
    }catch(err){
        throw err;
    }
 }
}