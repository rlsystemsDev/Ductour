var Helper = require('../config/helper');
var  Database = require('../config/database.js');
var path = require('path');
async = require("async");
var db = '';
var Promise = require('promise');


module.exports = class faq_model extends Helper{

    constructor(){
        super();
        db = new Database();
    }
    async get_faq(is_deleted,callback){
    //let is_deleted=0;
    try{
        //var ql='SELECT appointments.*,users.`username` FROM `appointments` LEFT JOIN users on appointments.user_id = users.id' 
        const[row, field] = await db.db_connect.execute('SELECT *   FROM `faqs`');
        //console.log(row);
        callback(row);
    }catch(err){
        throw err;
    }
 }
 async get_faqs(){
     try{
        const[row] = await db.db_connect.execute('SELECT *   FROM `faqs`');
     return row
     }catch(err){
         throw err;
     }
 }
}
