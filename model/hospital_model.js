var Helper = require('../config/helper');
var  Database = require('../config/database.js');
var path = require('path');
async = require("async");
var db = '';
var Promise = require('promise');


module.exports = class hospital_model extends Helper{

    constructor(){
        super();
        db = new Database();
    }
    async get_sponsorhospital(is_deleted,callback){
    //let is_deleted=0;
    try{
        //var ql='SELECT policies.*,users.`username` FROM `policies` LEFT JOIN users on policies.sponsorID = users.id'; 
        const[row, field] = await db.db_connect.execute('SELECT COUNT(sh.policy_id) as policies,hl.id,sh.location as location,hl.username,hl.email from sponsor_hospitals as sh LEFT JOIN hospital_login as hl on hl.id=sh.hospital_id  where hl.is_deleted="0" order by hl.id DESC');
       
        callback(row);
    }catch(err){
        throw err;
    }
 }

 async get_policies()
 {
    try{
        const[row] = await db.db_connect.execute('SELECT * from policies where is_deleted="0" ORDER BY id DESC');
        if(row!=''){
            return row;
        }else{
            return false;
        }
    }catch(err){
        throw err;
    }
 } 
 async save (data,callback) {
        try{
            
            let time = super.time();
            let hash = super.crypt(data.hospital_password);
            let rowss = '';
            const[row] = await db.db_connect.execute(`insert into hospital_login set username="${data.hospital_name}",email="${data.hospital_email}",password="${hash}",created=${time},modified=${time},is_deleted="0"`);
            if(row!=''){
                const [rows, fields] = await db.db_connect.execute('insert into sponsor_hospitals set hospital_id=?,location=?',[row.insertId,data.location]);
                if(rows!=''){
                    rowss =rows;
                }

            }
                    
            callback(rowss);
        }catch(err){
            throw err;
        }
        
    }

    async update_hospital_details (data,callback) {
        
            try{
       
            const [rows, fields] = await db.db_connect.execute('UPDATE sponsor_hospitals set hospital_name= ?,location= ? WHERE id="'+data.user_id+'"',[data.hospital_name,data.location]);
            
             callback(rows); 
        }catch(err){
            throw err;
        }
    }

    async get_hospital_data(data, callback)
    {
        try{
            
            let rows = '';
           const[row, fields] = await db.db_connect.execute(`select sponsor_hospitals.location,hospital_login.username,hospital_login.email from sponsor_hospitals LEFT JOIN hospital_login ON sponsor_hospitals.hospital_id=sponsor_hospitals.id`);
           if(row!=''){
            rows  = row;
           }
           
           callback(rows);
        }catch(err){
            throw err;
        }
    }

    async get_hospital_datas (data)
    {
        try{
            const[row] = await db.db_connect.execute('select * from hospital_login where id =?',[data]);
            if(row!=''){
                const[rows] = await db.db_connect.execute('SELECT p.name,p.interval,p.expiry_date,p.policy_number from policies as p join sponsor_hospitals as sh on sh.policy_id = p.id where sh.hospital_id=?',[row[0].id]);
                console.log('SELECT p.name,p.interval,p.expiry_date,p.policy_number from policies as p join sponsor_hospitals as sh on sh.policy_id = p.id where sh.hospital_id=?',[row[0].id]);   
                if(rows!=''){
                    for(let i in rows){
                            var year = new Date(rows[i].expiry_date).getFullYear();
                            var month =new Date(rows[i].expiry_date).getMonth();
                            var date =new Date(rows[i].expiry_date).getDate();
                            rows[i].expiry_date = year+':'+month+':'+date;
                    }
                    rows[0].policy_details = rows;
                    
                    return rows;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        }catch(err){
            throw err;
        }
    }
}