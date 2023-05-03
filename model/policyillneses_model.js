var Helper = require('../config/helper');
var  Database = require('../config/database.js');
var path = require('path');
async = require("async");
var db = '';
var Promise = require('promise');


module.exports = class policyillneses_model extends Helper{

    constructor(){
        super();
        db = new Database();
    }
    async get_policyillneses(is_deleted,callback){
    //let is_deleted=0;
    try{
        //var ql='SELECT appointments.*,users.`username` FROM `appointments` LEFT JOIN users on appointments.user_id = users.id' 
        const[row, field] = await db.db_connect.execute('SELECT *  FROM `policy_illnesses`' );
        //console.log(row);
        callback(row);
    }catch(err){
        throw err;
    }
 }
}
