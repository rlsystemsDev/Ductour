var Helper = require('../../config/helper');
var Database = require('../../config/database.js');
var path = require('path');
async = require("async");
var db = '';
var Promise = require('promise');
var crypto = require('crypto');


module.exports = class Hospitaldash_model extends Helper {

    constructor() {
        super();
        db = new Database();
    }
    async check_login(email, password, callback) {

        let hash = super.crypt(password);
        try {
            const [rows, fields] = await db.db_connect.execute('SELECT * FROM `hospital_details` WHERE `email` = ? AND `password` = ?', [email, hash]);
            // console.log(rows); 
            var rowss = '';
            if (rows.length > 0) {
                rowss = rows;
            }
            //console.log(rowss); 
            callback(rowss);
        } catch (err) {
            throw err;
        }

    }
    async get_userlist(is_deleted, callback) {
        //let is_deleted=0;
       
        try {
            //var ql='SELECT appointments.*,users.`username` FROM `appointments` LEFT JOIN users on appointments.user_id = users.id' 
            // const[row, field] = await db.db_connect.execute('select policies.name,users.username FROM user_policies JOIN policies ON user_policies.policy_id=policies.id JOIN users ON user_policies.user_id=users.id' );
            const [row, field] = await db.db_connect.execute('SELECT * from users where is_deleted ="0" and is_parent="0" ORDER by id DESC');
            //console.log(row);
            callback(row);
        } catch (err) {
            throw err;
        }
    }
   
    async illness_list(data, callback) {
        try {

            const [row, field] = await db.db_connect.execute('select user_illnesses.id,user_illnesses.illness_id,user_illnesses.user_id,users.username,policies.name as policy_name,illnesses.name as illness_name FROM user_illnesses left JOIN users ON users.id=user_illnesses.user_id left JOIN illnesses ON illnesses.id=user_illnesses.illness_id left JOIN policies ON policies.id=user_illnesses.id WHERE user_illnesses.is_deleted = 0 ORDER BY user_illnesses.id DESC ');
            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async illness_lists(data, callback) {
        try {
        
            console.log('SELECT claim_list_illness.id,claim_list_illness.otp,claim_list_illness.amount,claim_list_illness.images,claim_list_illness.no_claim,claim_list_illness.claim_date,claim_list_illness.varify_status,users.username,claim_list_illness.policy_number,illnesses.name  as illness_name  from claim_list left join users on claim_list.user_id= users.id left join claim_list_illness on claim_list.id= claim_list_illness.claim_request_id left join illnesses on claim_list_illness.illness_id=illnesses.id where claim_list_illness.id=?',[data]);


            const[Result]= await db.db_connect.execute('SELECT claim_list_illness.id,claim_list_illness.otp,claim_list_illness.amount,claim_list_illness.images,claim_list_illness.no_claim,claim_list_illness.claim_date,claim_list_illness.varify_status,users.username,claim_list_illness.policy_number,illnesses.name  as illness_name  from claim_list left join users on claim_list.user_id= users.id left join claim_list_illness on claim_list.id= claim_list_illness.claim_request_id left join illnesses on claim_list_illness.illness_id=illnesses.id where claim_list_illness.id=?',[data]);
            /* const [row, field] = await db.db_connect.execute('select claim_list.claim_date, claim_list.id ,policies.name as policy_name ,users.username,illnesses.name as illnesse_name, claim_list.policyNumber as policy_number,claim_list.no_claim from claim_list left join users on claim_list.user_id=users.id left JOIN illnesses on claim_list.illness_id=illnesses.id left join policies on claim_list.policy_id=policies.id where claim_list.id=?',[data]); */
           
            callback(Result);
        } catch (err) {
            throw err;
        }
    }
    async child_view(data,callback){
        try{
          let final_data='';
          if(data!=0){
             const[Details]= await db.db_connect.execute('SELECT * FROM `users` WHERE is_parent=?',[data]);
        final_data=Details;
          }
        callback(final_data);
        }catch(error){
            throw error;
        }
    }
    async list(data, callback) {

        const [rows, fields] = await db.db_connect.execute('select * from user_illnesses WHERE id=?', [data]);
        callback(rows);
    }
    async save_hospital(data, image, callback) {

        try {
            
            var time = Date.now();
            let hash = super.crypt(data.password);

            const [row, field] = await db.db_connect.execute('SELECT *  FROM `users` WHERE `is_deleted` = ? and email=?', ['0', data.email]);
            if (row != '') {

                var rows = 0;


            } else {
                let images = '';
                if (image != '') {

                    images = super.image_Upload(image);
                }

                if (path.extname(images)) {
                    images = images;
                } else {
                    images = ''
                }
                var time = Date.now();
                var n = time / 1000;
                time = Math.floor(n);
                
                const [rows, fields] = await db.db_connect.execute('insert into users set username=?,is_parent=?,address=?,city=?,state=?,dob=?,gender=?,blood_group=?,otp=?,email=?,image=?,created=?,password=?', [data.username,data.parent_id, data.address, data.city, data.state, data.dob, data.gender, data.blood_group, data.otp, data.email, images, time, hash]);

                // console.log(rows); 
            }


            callback(rows);

        } catch (err) {
            throw err;
        }

    }
    async update_hospital_details(data, image, callback) {
        try {

            var time = Date.now();
            let images = '';
            console.log(image);

            if (image != '') {

                images = super.image_Upload(image);
            }
            // console.log(images);return false;
            if (path.extname(images)) {
                images = images;
            } else {
                images = ''
            }
            const [row, field] = await db.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and id=?', ['0', data.user_id]);
            if (images == '') {

                images = row[0].image;

            }
            //console.log("wefwef"); return false;
            const [rows, fields] = await db.db_connect.execute('UPDATE `users` SET username = ?,is_parent=?, address = ?, city =?, state=?,dob =?,gender =?,blood_group = ?,image=?,otp=? where id=' + data.user_id + ' ', [data.username,data.parent_id, data.address, data.city, data.state, data.dob, data.gender, data.blood_group, images, data.otp]);
            //console.log(rows);

            callback(rows);
        } catch (err) {
            throw err;
        }
    }

    async edit_hospital(data, callback) {

        //console.log(data);
        // return false;
        try {
            const [rows] = await db.db_connect.execute('select * from users where id = "' + data + '"');
            /*console.log(rows);
            return false;*/
            callback(rows);
        } catch (err) {
            throw err;
        }



    }
    async get_profile(data, callback) {

       
        // return false;
        try {
            const [rows] = await db.db_connect.execute('select * from hospital_details where id = "' + data + '"');
            /*console.log(rows);
            return false;*/
            callback(rows);
        } catch (err) {
            throw err;
        }



    }
async get_password_page(data, callback) {

        //console.log(data);
        // return false;
        try {
            const [rows] = await db.db_connect.execute('select * from hospital_login where id = "' + data + '"');
            /*console.log(rows);
            return false;*/
            callback(rows);
        } catch (err) {
            throw err;
        }



    }

    async update_hospital_profile(data, session, image, callback) {
        try {
            var time = Date.now();
            let images = '';


            if (image != '') {

                images = super.image_Upload(image);
            }
            if (path.extname(images)) {
                images = images;
            } else {
                images = ''
            }

            let rr = '';
            const [row, field] = await db.db_connect.execute('SELECT * FROM `hospital_details` WHERE `is_deleted` = ? and id=?', ['0', session]);

            if (row != '') {
                if (images == '') {
                    images = row[0].image;

                }
              
                const [rows, fields] = await db.db_connect.execute('UPDATE `hospital_details` SET name = ?, image=? where id=' + row[0].id + ' ', [data.username, images]);
                if (rows != '') {

                    const [r] = await db.db_connect.execute('select * from hospital_details where id=? && is_deleted="0"', [row[0].id]);

                    if (r != '') {
                        rr = r;
                    }

                }

            }
            callback(rr);
        } catch (err) {
            throw err;
        }
    }

    async get_dashboard_data(datas) {
        try {
           
            const [row] = await db.db_connect.execute('SELECT claim_list_illness.no_claim, claim_list.id,users.username,claim_list_illness.policy_number,illnesses.name  as illness_name from claim_list left join users on claim_list.user_id= users.id left join claim_list_illness on claim_list.id= claim_list_illness.claim_request_id left join illnesses on claim_list_illness.illness_id=illnesses.id where claim_list.hospital_id=? group by claim_list.id',[datas]);
           /*  const[rows]= await db.db_connect.execute('select claim_list.claim_date,claim_list.id ,policies.name as policy_name ,users.username,illnesses.name as illnesse_name, claim_list.policyNumber as policy_number,claim_list.no_claim from claim_list left join users on claim_list.user_id=users.id left JOIN illnesses on claim_list.illness_id=illnesses.id left join policies on claim_list.policy_id=policies.id where claim_list.hospital_id=?',[datas]); */
            let data = '';
            data = {
                claim: row.length,
               // user_illnesses: rows.length
            }
            
            return data;
        } catch (err) {
            throw err;
        }
    }

    async check_password(data) {
        try {
            let hash = super.crypt(data.old_password);
            const [row] = await db.db_connect.execute('select * from hospital_details where password=? and id=?', [hash, data.id]);
            return row;
        } catch (err) {
            throw err;
        }
    }

    async save_passwordd(data, session, callback) {
        //console.log(session);return false;
        try {
            let hash = super.crypt(data.confirm_password);



            const [row, field] = await db.db_connect.execute('UPDATE `hospital_details` SET password = ? where id="' + session + '" ', [hash]);
            //console.log(row); return false;

            callback(row);
        } catch (err) {
            throw err;
        }
    }

    async gettotalpolicies(data) {
        try {
            const [gettotalpolicies] = await db.db_connect.execute('select policy_min,policy_max from policies where sponsorID=?', [data.h_id]);
            let value = '0';
            if (gettotalpolicies != '') {
                value = gettotalpolicies[0].policy_max - gettotalpolicies[0].policy_min;
            }
            return value;
        } catch (err) {
            throw err;
        }
    }

    async policyTaken(data) {
        try {
            const [policyTaken] = await db.db_connect.execute('select count(*) as takenPolicy from claim_list where hospital_id=?', [data.h_id]);
            return policyTaken;
        } catch (err) {
            throw err;
        }
    }

    async policyList(data) {
        
        const [policyList] = await db.db_connect.execute("SELECT c.id,c.no_claim,(SELECT COUNT(*) FROM claim_list WHERE claim_list.user_id = u.id && claim_list.hospital_id=1) as claimCount,c.policyNumber,IFNULL(i.name,'') as i_name,IFNULL(u.username,'') as u_username,IFNULL(h.username,'') as h_username,IFNULL(p.name,'') as p_name from claim_list as c JOIN users as u on u.id = c.user_id JOIN illnesses as i on i.id=c.illness_id JOIN policies as p on p.id = c.policy_id JOIN hospital_login as h on h.id = c.hospital_id where c.is_deleted='0' && h.is_deleted='0' && u.is_deleted='0' && i.is_deleted='0' && c.hospital_id=? GROUP BY u.id ORDER by c.id DESC", [data.h_id]);
        return policyList;
    }
    async checkOtp(data) {
        //console.log(data,"============");return;
        let items= data.items;
        let selecteditems= items.toString();

        //getitems costs//

        let getitems= await db.db_connect.execute('select SUM(cost) as amount from item where id IN ('+selecteditems+')');
     
        const[getRange]= await db.db_connect.execute('select ill_range from illness_range');
       
        const[getMyApplied]= await db.db_connect.execute('select COUNT(id) as count from users_policy_history where user_id=? and claim_id=?',[data.id,data.claim_id]);
    
        if(getMyApplied[0].count!==getRange[0].ill_range){
        const [checkAlreadyOtp] = await db.db_connect.execute("select count(id) as id from users_policy_history  where user_id=? && claim_id=? && illness_id=? && otp=?",[data.id,data.claim_id,data.Illness,data.claim]);
        
        if(checkAlreadyOtp[0].id==0){
            const [checkOtp] = await db.db_connect.execute("select * from  policy_otp_status  where  claim_id=? && otp=? && user_id=?", [data.claim_id,data.claim, data.id]);
            if (checkOtp != '') {
                let claim = parseInt(checkOtp[0].no_claim) + parseInt('1');
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                var newdate=dd + "-" + mm + "-" + yyyy;
               console.log('insert into users_policy_history set user_id=?,claim_id=?,illness_id=?,otp=?,text=?,claim_date=?,item_ids=?,amount=?',[data.id,data.claim_id,data.Illness,data.claim,data.text,newdate,selecteditems,getitems[0].amount]);
                const[insertintohistoey]= await db.db_connect.execute('insert into users_policy_history set user_id=?,claim_id=?,illness_id=?,otp=?,text=?,claim_date=?,item_ids=?,amount=?',[data.id,data.claim_id,data.Illness,data.claim,data.text,newdate,selecteditems,getitems[0][0].amount]);
                return insertintohistoey;
            } else {
                return 2;
            }
        }else{
           return 3;
        }
    }else{
        return 4; 
    }
       
    }
    async get_all_claim(data){
        try{
            
            const[Details]= await db.db_connect.execute('SELECT claim_list.id as claimId, users.id as userid,claim_list_illness.id,claim_list_illness.otp,claim_list_illness.amount,claim_list_illness.images,claim_list_illness.no_claim,claim_list_illness.claim_date,claim_list_illness.varify_status,users.username,claim_list_illness.policy_number,illnesses.name  as illness_name,claim_list_illness.illness_id as illnessId  from claim_list left join users on claim_list.user_id= users.id left join claim_list_illness on claim_list.id= claim_list_illness.claim_request_id left join illnesses on claim_list_illness.illness_id=illnesses.id where claim_list.hospital_id=? order by claim_list.id desc',[data]);
       console.log(Details,"=======================find");
       return Details;
        }catch(error){
            throw error;
        }
    }
    async amount_sent(data,image){
        try{
            let images = '';
            if (image != '') {

                images = super.image_Upload(image);
            }

            if (path.extname(images)) {
                images = images;
            } else {
                images ='';
            }
          
        
         const[ClaimAmount]= await db.db_connect.execute('update claim_list set amount=?,images=? where id=?',[data.amount,images,data.mdels])
         console.log(ClaimAmount);
         return ClaimAmount;
        }catch(e){
            throw e;
        }
    }
    async get_hosp_users(data){
        try{
            let today=Math.floor(Date.now() / 1000);
            
            console.log('SELECT claim_list_illness.no_claim as no_claim,claim_list_illness.expiry_date, claim_list.policy_status,users.*,claim_list.id as claimId,claim_list_illness.policy_number,illnesses.name  as illness_name  from claim_list left join users on claim_list.user_id= users.id left join claim_list_illness on claim_list.id= claim_list_illness.claim_request_id left join illnesses on claim_list_illness.illness_id=illnesses.id where claim_list.hospital_id='+data+' group by claim_list_illness.policy_number  order by claim_list.id desc');

            const[Details]= await db.db_connect.execute('SELECT  claim_list_illness.no_claim ,claim_list_illness.expiry_date,users.id as userid, claim_list.policy_status,users.*,claim_list.id as claimId,claim_list_illness.policy_number,illnesses.name  as illness_name  from claim_list left join users on claim_list.user_id= users.id left join claim_list_illness on claim_list.id= claim_list_illness.claim_request_id left join illnesses on claim_list_illness.illness_id=illnesses.id where claim_list.hospital_id='+data+' group by claim_list_illness.policy_number  order by claim_list.id desc');

            if(Details.length>0){
            const[getused]= await db.db_connect.execute('select count(id)as usedPolicy from users_policy_history where claim_id=?',[Details[0].claimId]);
          
            if(Details[0].expiry_date<today || getused[0].usedPolicy==4){
                Details[0].policy_status=1;
            }else{
                Details[0].policy_status=0;
            }
        }
           
            return Details;
        
        }catch(err){
            throw err;
        }
    }
    async get_hosp_users_meal(data){
        try{
            let today=Math.floor(Date.now() / 1000);

            // console.log('SELECT claim_list_illness.expiry_date, claim_list.policy_status,users.*,claim_list.id as claimId,claim_list_illness.policy_number,illnesses.name  as illness_name  from claim_list left join users on claim_list.user_id= users.id left join claim_list_illness on claim_list.id= claim_list_illness.claim_request_id left join illnesses on claim_list_illness.illness_id=illnesses.id where claim_list.hospital_id='+data+' group by claim_list_illness.policy_number  order by claim_list.id desc');
            // console.log('SELECT claim_list_illness.expiry_date, claim_list.policy_status,users.*,claim_list.id as claimId,claim_list_illness.policy_number,illnesses.name  as illness_name  from claim_list left join users on claim_list.user_id= users.id left join claim_list_illness on claim_list.id= claim_list_illness.claim_request_id left join illnesses on claim_list_illness.illness_id=illnesses.id left join ducmeal_code ON ducmeal_code.claim_id= claim_list.id where ducmeal_code.rest_id='+data+' group by claim_list_illness.policy_number  order by claim_list.id desc');return;

            const[Details]= await db.db_connect.execute('SELECT claim_list_illness.expiry_date, claim_list.policy_status,users.*,claim_list.id as claimId,claim_list_illness.policy_number,illnesses.name  as illness_name  from claim_list left join users on claim_list.user_id= users.id left join claim_list_illness on claim_list.id= claim_list_illness.claim_request_id left join illnesses on claim_list_illness.illness_id=illnesses.id left join ducmeal_code ON ducmeal_code.claim_id= claim_list.id where ducmeal_code.rest_id='+data+' group by claim_list_illness.policy_number  order by claim_list.id desc');

            if(Details.length>0){
            const[getused]= await db.db_connect.execute('select count(id)as usedPolicy from users_policy_history where claim_id=?',[Details[0].claimId]);
          
            if(Details[0].expiry_date<today || getused[0].usedPolicy==4){
                Details[0].policy_status=1;
            }else{
                Details[0].policy_status=0;
            }
        }
           
            return Details;
        
        }catch(err){
            throw err;
        }
    }
    async getAllPolicyDetails(ClaimId){
        try{
            const[Details]= await db.db_connect.execute('SELECT ifnull(users_policy_history.claim_date,"") AS claimDate,illnesses.id as illnessId,claim_list.id as claimId, users.id as userid,claim_list_illness.id,claim_list_illness.otp,claim_list_illness.amount,claim_list_illness.images,claim_list_illness.no_claim,claim_list_illness.created_at,claim_list_illness.varify_status,users.username,claim_list_illness.policy_number,illnesses.name  as illness_name  from claim_list left join users on claim_list.user_id= users.id left join claim_list_illness on claim_list.id= claim_list_illness.claim_request_id left join illnesses on claim_list_illness.illness_id=illnesses.id LEFT JOIN users_policy_history ON users_policy_history.illness_id=claim_list_illness.illness_id where claim_list.id=? order by claim_list.id desc',[ClaimId]);

            console.log('SELECT ifnull(users_policy_history.claim_date,"") AS claimDate,illnesses.id as illnessId,claim_list.id as claimId, users.id as userid,claim_list_illness.id,claim_list_illness.otp,claim_list_illness.amount,claim_list_illness.images,claim_list_illness.no_claim,claim_list_illness.created_at,claim_list_illness.varify_status,users.username,claim_list_illness.policy_number,illnesses.name  as illness_name  from claim_list left join users on claim_list.user_id= users.id left join claim_list_illness on claim_list.id= claim_list_illness.claim_request_id left join illnesses on claim_list_illness.illness_id=illnesses.id LEFT JOIN users_policy_history ON users_policy_history.illness_id=claim_list_illness.illness_id where claim_list.id=? order by claim_list.id desc',[ClaimId]);
            return Details;
        }catch(err){
            throw err;
        }
    }
    async CheckPolicyNumber(Docid){
        try{
            const[getData]= await db.db_connect.execute('SELECT sponser_login.username as sponse_name, hospital_details.name as hospital_name,illnesses.id as illnessId,claim_list.id as claimId, users.id as userid,claim_list_illness.id,claim_list_illness.otp,claim_list_illness.amount,claim_list_illness.expiry_date,claim_list_illness.images,claim_list_illness.no_claim,claim_list_illness.created_at,claim_list_illness.varify_status,users.username,claim_list_illness.policy_number,illnesses.name as illness_name from claim_list left join users on claim_list.user_id= users.id left join claim_list_illness on claim_list.id= claim_list_illness.claim_request_id left join illnesses on claim_list_illness.illness_id=illnesses.id left JOIN hospital_details on hospital_details.id=claim_list.hospital_id LEFT JOIN sponser_login on sponser_login.id=claim_list.sponser_id where claim_list_illness.policy_number="'+Docid+'" order by claim_list.id desc');
            
            
            return getData
        }catch(err){
            throw err;
        }
    }
    async getRemining(claimId){
        try{
           
            //const[getclaim]=await db.db_connect.execute('select count(id)as usedPolicy from users_policy_history where user_id=? and claim_id=?',[userId,claimId]);

            // const[getclaim]= await db.db_connect.execute('select count(claim_list_illness.id) as total,count(policy_otp_status.id) as used from claim_list_illness left join policy_otp_status on claim_list_illness.claim_request_id=policy_otp_status.claim_id where claim_list_illness.claim_request_id=?',[claimId]);
            const[getclaim]=await db.db_connect.execute('select count(users_policy_history.id) as used from users_policy_history where claim_id=?',[claimId]);
            //const[getclaim]= await db.db_connect.execute('select count(claim_list_illness.id) as total,count(users_policy_history.id) as used from claim_list_illness left join users_policy_history on claim_list_illness.claim_request_id=users_policy_history.claim_id where claim_list_illness.claim_request_id=?',[claimId]);
            getclaim[0].total=4
           
            return getclaim;
        }catch(err){
            throw err;
        }
    }
    async getmyitem(illnessid,callback) {
        try {
            let itemNameArray = [];
            const [rows] = await db.db_connect.execute('SELECT items FROM illnesses where  id = ?', [illnessid]);
           
             var multipleItems = JSON.parse(rows[0].items);
           
             for(let i in multipleItems){
                
                //for(let j in rows[i].items){
                let getItemNames = await db.db_connect.execute('select  id , name from item where id = ?',[multipleItems[i]]);
                  // console.log(getItemNames[0],"=======getItemNames");
                   itemNameArray.push({
                       id: getItemNames[0][0].id,
                       name: getItemNames[0][0].name
                   });
                //   console.log(itemNameArray,"=============itemNameArray");
               //  }
             }
            // console.log(itemNameArray,"=======");
            // return false;
             return itemNameArray;
            var rowss = '';
            if (rows.length > 0) {
                rowss = rows;
            }
            //console.log(rowss); 
            callback(rowss);
        } catch (err) {
            throw err;
        }

    }
}