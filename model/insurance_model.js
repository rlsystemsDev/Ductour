var Helper = require('../config/helper');
var  Database = require('../config/database.js');
var path = require('path');
async = require("async");
var db = '';
var Promise = require('promise');
module.exports = class insurance_model extends Helper{

    constructor(){
        super();
        db = new Database();
    }
   
   async get_insurance_list (data, callback){
   	 //console.log("fewf"); 
        try{
           const [row, field] = await db.db_connect.execute('select user_policies.id ,user_policies.bvn_code,users.username,childs.name as c_name,policies.name as p_name from user_policies JOIN childs ON user_policies.child_id=childs.id JOIN users ON user_policies.user_id=users.id JOIN policies ON user_policies.policy_id=policies.id');
            callback(row);
        }catch(err){
            throw err;
        }
    }
    async view_insurance_detail (data, callback){
        
        try{
            
            const [row, field] = await db.db_connect.execute('select user_policies.id ,user_policies.bvn_code,users.username,childs.name as c_name,policies.name as p_name from user_policies JOIN childs ON user_policies.child_id=childs.id JOIN users ON user_policies.user_id=users.id JOIN policies ON user_policies.policy_id=policies.id');
            callback(row); 
        }catch(err){
            throw err;
        }
    }
     async get_claim_list (data, callback){
        try{

        //old

        //    const[row]= await db.db_connect.execute("select  ducmeal_code.code as mealcode,ducmeal.name as restro_name,ducmeal.group_code as groupCode,policies.name as policyname,claim_list.policy_status,cl.created_at,cl.expiry_date,users.id as userId,claim_list.id as claimId,hospital_details.name as hospital_name,users.username,cl.id,cl.policy_number,illnesses.name,cl.claim_date as claim_date,cl.no_claim from claim_list_illness as cl LEFT JOIN claim_list on cl.claim_request_id=claim_list.id LEFT JOIN illnesses on cl.illness_id=illnesses.id LEFT JOIN users ON claim_list.user_id= users.id left JOIN hospital_details on claim_list.hospital_id=hospital_details.id left JOIN policies on policies.id=claim_list.policy_id  left join ducmeal_code on ducmeal_code.claim_id=claim_list.id left JOIN ducmeal on  ducmeal.id=ducmeal_code.rest_id group by cl.policy_number");

        //
        const[row]=await db.db_connect.execute("select claim_list.payment_status,ducmeal_code.code as mealcode,ducmeal.name as restro_name,ducmeal.group_code as groupCode,policies.name as policyname,claim_list.policy_status,cl.created_at,cl.expiry_date,users.id as userId,claim_list.id as claimId,hospital_details.name as hospital_name,users.username,cl.id,cl.policy_number,illnesses.name,cl.claim_date as claim_date,cl.no_claim from claim_list_illness as cl LEFT JOIN claim_list on cl.claim_request_id=claim_list.id LEFT JOIN illnesses on cl.illness_id=illnesses.id LEFT JOIN users ON claim_list.user_id= users.id left JOIN hospital_details on claim_list.hospital_id=hospital_details.id left JOIN policies on policies.id=claim_list.policy_id  left join ducmeal_code on ducmeal_code.claim_id=claim_list.id left JOIN ducmeal on  ducmeal.id=ducmeal_code.rest_id group by cl.policy_number");
          
           if(row.length>0){
            for(let i in row){
               
                let all= 4;
                let userId= row[i].userId;
                let claimId= row[i].claimId;
            const[getused]= await db.db_connect.execute('select count(id)as usedPolicy from users_policy_history where user_id=? and claim_id=?',[userId,claimId]);
            for(let j in getused){
            
            let unused= all-getused[j].usedPolicy;
            let today=Math.floor(Date.now() / 1000);
            row[i].unused=unused;
            row[i].used=getused[j].usedPolicy;
            console.log(row[i].expiry_date<today || row[i].unused==0,"==sdd");
            if(row[i].expiry_date<today || row[i].unused==0){
                row[i].policy_status=1;
            }else{
                row[i].policy_status=0;
            }
            }
            
        } 
    }     
     console.log(row,"==========check status");
    callback(row)
        }catch(err){
            throw err;
        }
    }
   async view_claim_detail (data, callback){
        
        try{
            let rows = '';

            //old without resturent name
            // console.log("select hospital_details.name as hospital_name,users.username,cl.id,cl.policy_number,illnesses.name,cl.claim_date,cl.no_claim from claim_list_illness as cl LEFT JOIN claim_list on cl.claim_request_id=claim_list.id LEFT JOIN illnesses on cl.illness_id=illnesses.id LEFT JOIN users ON claim_list.user_id= users.id left JOIN hospital_details on claim_list.hospital_id=hospital_details.id where cl.id=? ",[data]);

             const [row, field] = await db.db_connect.execute("select ducmeal.name as mealname,hospital_details.name as hospital_name,users.username,users.address,users.gender,users.phone_number,cl.id,cl.policy_number,illnesses.name,cl.claim_date,cl.no_claim from claim_list_illness as cl LEFT JOIN claim_list on cl.claim_request_id=claim_list.id LEFT JOIN illnesses on cl.illness_id=illnesses.id LEFT JOIN users ON claim_list.user_id= users.id left JOIN hospital_details on claim_list.hospital_id=hospital_details.id  left JOIN policies on policies.id = claim_list.policy_id left join ducmeal on ducmeal.id=policies.restro_id where cl.id=?",[data]);
         
           
            if(row!=''){; 
                rows = row;
            }
            callback(rows); 
        }catch(err){
            throw err;
        }
    }

}