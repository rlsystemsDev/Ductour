var Helper = require('../config/helper');
var Database = require('../config/database.js');
var path = require('path');
async = require("async");
var db = '';
var Promise = require('promise');
var crypto = require('crypto');


module.exports = class hmo_model extends Helper {

    constructor() {
         
        super();
        db = new Database();
    }

    async get_hmo_list(data,callback){ 
        const[List]= await db.db_connect.execute('select * from hmo_login where is_deleted=? order by  id DESC',[0]);
   
    callback(List);
    }

    async save_hmo(data,callback) {
        try{
           
            let final_data='';

            const [hmoDetailss] = await db.db_connect.execute('SELECT *  FROM `hmo_login` WHERE `is_deleted` = ? and email=?', ['0',data.email]);
            final_data=hmoDetailss;

                if(hmoDetailss==''){
                
                /* let images = '';
                if(image!=''){
                   
                    images = super.image_Upload(image);
                }
                
                if(path.extname(images)){
                     images = images;
                }else{
                     images = ''
                } */
                var created = new Date();
                let hash = super.crypt(data.password);
               const [hmoDetails] = await db.db_connect.execute('insert into hmo_login set name=?,address=?,email=?,password=?,created=?',[data.username,data.address,data.email,hash,created]);
               final_data=hmoDetails;
               super.send_hmo_emails(data.email,data.username,data.password);
            callback(final_data);
            }   
        }catch(err){
            throw err;
        }
        
    }
    async get_hmo(data,callback){
        try{
            const[Details]= await db.db_connect.execute('select * from hmo_login where id=?',[data]);

        callback(Details);
        }catch(e){
            throw e;
        }
    }
    async update_hmo_details(data,callback){
        try{
            
            var modify = new Date();
            
            const[Upate]= await db.db_connect.execute('update hmo_login  set name=?,address=?,modified=? where id=?',[data.username,data.address,modify,data.user_id]);
        callback(Upate);
        }catch(err){
            throw err;
        }
    }
    async view_hmo_detail(data,callback){
        try{
           const[View]= await db.db_connect.execute('select * from hmo_login where id=?',[data]);
        callback(View);
        }catch(error){
            throw error;
        }
    }
    async updateStatus(data,callback){
       try{
        console.log(data,'data');
        const[row]= await db.db_connect.execute('update hmo_login set status=? where id=?',[data.status,data.id]);
      
       callback(row);
       }catch(e){
           throw e;
       }
    }
    async check_login(email, password, callback) {
       
        let hash = super.crypt(password);
       
        try {
            
            const [rows] = await db.db_connect.execute('select * from hmo_login where email=? and password=?',[email,hash]);
            var rowss = '';
            if (rows.length > 0) {
                rowss = rows;
            }
           
            callback(rowss);
        } catch (err) {
            throw err;
        }

    }
    async get_active_hmo(){
       try{
         const[Details]= await db.db_connect.execute('select * from hmo_login where is_deleted=? and status=?',[0,1]);
       return Details;
       }catch(e){
           throw e;
       }
   }
   async get_hmo_policy(data){
       try{
      
       const[list]= await db.db_connect.execute('select policies.* from policies where hmo_id=?',[data]);
    
       return list;
       }catch(error){
           throw error;
       }
   }
   async get_claim(data){
       try{
       
        /* const[List]= await db.db_connect.execute("SELECT cl.id,cl.Date,cl.no_claim,cl.otp,IFNULL(p.name,'') as policy_name,p.policy_number,IFNULL(hl.username,'') as hospital_name,IFNULL(u.username,'')as username from claim_list as cl LEFT join policies as p ON cl.policy_id = p.id LEFT JOIN users as u ON cl.user_id = u.id LEFT JOIN hospital_login as hl on hl.id = cl.hospital_id ORDER BY cl.id DESC") */
        //console.log(List);return false;
        const[AllClaim]= await db.db_connect.execute('select claim_list.policy_status, users.gender,users.dob, claim_list_illness.amount,claim_list_illness.expiry_date,claim_list_illness.created_at, claim_list_illness.varify_status,claim_list_illness.redeem_status,hospital_details.name as hospital_name,claim_list_illness.id ,users.username,illnesses.name as illness_name, claim_list_illness.policy_number as policy_number,claim_list_illness.no_claim from claim_list_illness left join claim_list on claim_list.id= claim_list_illness.claim_request_id left JOIN users on users.id=claim_list.user_id left JOIN illnesses on claim_list_illness.illness_id=illnesses.id LEFT JOIN hospital_details on hospital_details.id= claim_list.hospital_id LEFT JOIN  policies ON claim_list.policy_id = policies.id where  policies.hmo_id=? group by claim_list_illness.policy_number',[data]);
     
        // const[AllClaim]= await db.db_connect.execute('select  illnesses.name,hospital_login.username as hospital_name,claim_list.id ,policies.name as policy_name ,users.username,illnesses.name as illnesse_name, claim_list.policyNumber as policy_number,claim_list.no_claim from claim_list left join users on claim_list.user_id=users.id left JOIN illnesses on claim_list.illness_id=illnesses.id left join policies on claim_list.policy_id=policies.id left join hospital_login on hospital_login.id=claim_list.hospital_id where claim_list.no_claim=1')
        
        return AllClaim;
       }catch(error){
           throw error;
       }
   }
   async edit_details(data){
       try{
        const[Details]= await db.db_connect.execute('select  id,amount,varify_status,redeem_status from claim_list_illness where id=?',[data]);
        return Details;
       }catch(e){
           throw e;
       }
   }
   async update_details(data){
       try{
      
        
       const[UpdateDetails]= await db.db_connect.execute('update claim_list_illness set amount=?,varify_status=?,redeem_status=? where id=?',[data.amount,data.varify,data.redeem,data.user_id]);
       const[ClaimDetails]= await db.db_connect.execute('select * from claim_list_illness where id=?',[data.user_id]);
       
       if(ClaimDetails[0].varify_status==1){
           super.send_claim_notification()
       }
    
        return UpdateDetails;
       }catch(er){
           throw er;
       }
   }
   async get_dashboard_data(data){
      try{
        const[claimData]= await db.db_connect.execute('select claim_list_illness.varify_status,claim_list_illness.redeem_status,illnesses.name,hospital_details.name as hospital_name,claim_list_illness.id ,users.username,illnesses.name as illnesse_name, claim_list_illness.policy_number as policy_number,claim_list_illness.no_claim from claim_list_illness left join claim_list on claim_list.id= claim_list_illness.claim_request_id left JOIN users on users.id=claim_list.user_id left JOIN illnesses on claim_list_illness.id=illnesses.id LEFT JOIN hospital_details on hospital_details.id= claim_list.hospital_id LEFT JOIN  policies ON claim_list.user_id = policies.id where claim_list_illness.no_claim=1 && policies.hmo_id=?',[data]);
        /* const[claimData]= await db.db_connect.execute('select claim_list.varify_status,claim_list.redeem_status,illnesses.name,hospital_login.username as hospital_name,claim_list.id ,policies.name as policy_name ,users.username,illnesses.name as illnesse_name, claim_list.policyNumber as policy_number,claim_list.no_claim from claim_list left join users on claim_list.user_id=users.id left JOIN illnesses on claim_list.illness_id=illnesses.id left join policies on claim_list.policy_id=policies.id left join hospital_login on hospital_login.id=claim_list.hospital_id where claim_list.no_claim=1 && policies.hmo_id=?',[data]); */
        var datas = {};
        datas = {
            claim: claimData.length,
           

        };
        return datas;
      }catch(err){
          throw err;
      }
   }
}