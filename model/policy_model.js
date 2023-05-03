var Helper = require('../config/helper');
var Database = require('../config/database.js');
var path = require('path');
async = require("async");
var db = '';
var Promise = require('promise');


module.exports = class policy_model extends Helper {

    constructor() {
        super();
        db = new Database();
    }
    async get_policy(is_deleted, callback) {
        //let is_deleted=0;
        try {
            //var ql='SELECT policies.*,users.`username` FROM `policies` LEFT JOIN users on policies.sponsorID = users.id'; 

            const [row, field] = await db.db_connect.execute("SELECT policies.name,policies.no_policy,policies.policy_left,policies.id,IFNULL(hospital_details.name,'') as hospital_name,IFNULL(hmo_login.name,'') as hmo_name,policies.sponsorID,policies.description,policies.expiry_date,sp.username as s_username FROM policies LEFT JOIN sponser_login as sp on sp.id = policies.sponsorID left JOIN hospital_details on hospital_details.id=policies.hospital_id left join hmo_login on policies.hmo_id=hmo_login.id WHERE policies.is_deleted='0' ORDER BY policies.id DESC");
            /* if (row != '') {
                for (let i in row) {
                    let illness_id = JSON.parse(row[i].illness_id);
                    const [get_illness] = await db.db_connect.execute('select name from illnesses where id IN(' + illness_id + ')');
                    let illness = new Array();
                    for (let j in get_illness) {
                        if (get_illness[j].name != '') {
                            illness.push(get_illness[j].name);
                        }
                    }
                    row[i].illness_id = illness;
                }
            } */
            
            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async view_policy_detail(data, callback) {
        try {
            const [row, field] = await db.db_connect.execute("SELECT policies.name,policies.no_policy,policies.no_mealalloted,policies.id,IFNULL(hospital_details.name,'') as hospital_name,IFNULL(hmo_login.name,'') as hmo_name,policies.sponsorID,policies.description,policies.expiry_date,sp.username as s_username FROM policies LEFT JOIN sponser_login as sp on sp.id = policies.sponsorID left JOIN hospital_details on hospital_details.id=policies.hospital_id left join hmo_login on policies.hmo_id=hmo_login.id WHERE policies.is_deleted='0' && policies.id=?", [data]);

            /* const [row, field] = await db.db_connect.execute('SELECT policies.name,policies.id, policies.policy_min,policies.policy_max,policies.description,policies.expiry_date,policies.illness_id FROM policies WHERE policies.is_deleted="0" && policies.id=?', [data]); */
           // let illness_id = JSON.parse(row[0].illness_id);
            /* const [get_illness] = await db.db_connect.execute('select name from illnesses where id IN(' + illness_id + ')');
            let illness = new Array(); */
            /* for (let j in get_illness) {
                if (get_illness[j].name != '') {
                    illness.push(get_illness[j].name);
                }
            }
            row[0].illness_id = illness; */
        
            callback(row);
        } catch (err) {
            throw err;
        }
    }


    async illness_name() {
        try {
            const [row, field] = await db.db_connect.execute("SELECT * FROM illnesses");
            return row;
        } catch (err) {
            throw err;
        }
    }

    async update_policy_details(data, callback) {
        try {
           // console.log(data.user_id,'userid');return false;
            const[CheckPlicy]= await db.db_connect.execute('select no_policy,policy_left from policies where id=?',[ data.user_id]);
            var left=data.policy_no-CheckPlicy[0].no_policy;

            var left_policy= CheckPlicy[0].policy_left + left;
            
           

            const [row, field] = await db.db_connect.execute('UPDATE `policies` SET name = ?,no_policy = ?,expiry_date=?,policy_left=?,sponsorID=?,hmo_id=?,hospital_id=?,restro_id=?,no_mealalloted=? where id=' + data.user_id + ' ', [data.policy_name, data.policy_no,data.expiry_date,left_policy,data.sponsers_id,data.hmo_id,data.hospital,data.restaurant,data.no_ducmeal]);
            console.log(row,'update');
            let  q =  "";
            let  first =  true;
             for (let i in data.hospital)
             {
                 if(first)
                 {
                     first =  false;
                 }
                 else
                 {
                     q += ",";  
                 }
                 q += "("+data.user_id+","+data.hospital[i]+")";
                 // let t  = [rows.insertId ,data.hospital[i]];
                 // console.log(t);
                 // data_insert.push(t);
                
             }
             console.log(q,'in updating');
             const[deleteOld]= await db.db_connect.execute('delete from policy_hospital where policy_id=?',[data.user_id]);
             console.log(deleteOld,'deleteOld');
            
             const[UpdateSeparateHos_id]= await db.db_connect.execute("INSERT INTO policy_hospital (policy_id, hospital_id) VALUES "+q);
             console.log(UpdateSeparateHos_id,'UpdateSeparateHos_id');
             /* const[UpdateSeparateHos_id]= await db.db_connect.execute("update  policy_hospital set (policy_id, hospital_id) VALUES "+q); */
             
               console.log(UpdateSeparateHos_id); 
           
            callback(UpdateSeparateHos_id);
        } catch (err) {
            throw err;
        }
    }

    async save_policy(data, callback) {
        try {
            
          
           
            const [rows, fields] = await db.db_connect.execute('insert into policies set name=?,no_policy=?,policy_left=?,expiry_date=?,sponsorID=?,hmo_id=?,restro_id=?,hospital_id=?,no_mealalloted=?', [data.policy_name, data.policy_no, data.policy_no,data.expiry_date, data.sponsers_id,data.hmo_id,data.restaurant, data.hospital,data.no_ducmeal]);
            
            //////insrting hospital_id in hospital_policies using last insert id //////
            //console.log(data.hospital);return false;
           // let data_insert = [];
           let  q =  "";
           let  first =  true;
            for (let i in data.hospital)
            {
                if(first)
                {
                    first =  false;
                }
                else
                {
                    q += ",";  
                }
                q += "("+rows.insertId+","+data.hospital[i]+")";
                // let t  = [rows.insertId ,data.hospital[i]];
                // console.log(t);
                // data_insert.push(t);
               
            }
           // console.log(data_insert);
           // var sql = "INSERT INTO policy_hospital (policy_id, hospital_id) VALUES ?";
           console.log("INSERT INTO policy_hospital (policy_id, hospital_id) VALUES "+q);
          const[SaveSeparateHos_id]= await db.db_connect.execute("INSERT INTO policy_hospital (policy_id, hospital_id) VALUES "+q);

            console.log(SaveSeparateHos_id); 
            callback(rows);
        } catch (err) {
            throw err;
        }
    }

    async get_policy_detail(data, callback) {
        try {
            const [row, field] = await db.db_connect.execute('SELECT * FROM `policies` WHERE `is_deleted` = ? and id=?', ['0', data]);
            let job=row[0].hospital_id;
            
           // console.log('SELECT * FROM `policies` WHERE `is_deleted` = ? and id=?', ['0', data],'job======================  ');return false;
            row[0].hospital_id=JSON.parse(job);
            //var integer = parseInt(row[0].hospital_id);
            row[0].hospital_id=(row[0].hospital_id);
            // console.log(row[0].hospital_id,'gt');
           
            callback(row);
        } catch (err) {
            throw err;
        }
    }

    async get_sponsers() {
        try {
            const [get_sponsers] = await db.db_connect.execute('select * from sponser_login where is_deleted=?', [0]);

            return get_sponsers;
        } catch (err) {
            throw err;
        }
    }
    async get_hmo(){
        try{
            const[HmoDetails]= await db.db_connect.execute('select * from  hmo_login where is_deleted=? and status=?',[0,1]);
        return HmoDetails;
        }catch(er){
            throw er;
        }
    }
    async get_hospital(){
        try{
            const[Hospitals]= await db.db_connect.execute('select * from  hospital_details  where is_deleted=? and status=?',[0,1]);
        return Hospitals;
        }catch(er){
            throw er;
        }
    }
    async getmeal(){
        try{
            const[details]= await db.db_connect.execute('select * from  ducmeal where  status=?',[1]);
        return details;
        }catch(er){
            throw er;
        }
    }
}
