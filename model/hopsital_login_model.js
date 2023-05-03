var Helper = require('../config/helper');
var  Database = require('../config/database.js');
var  constant = require('../config/constant.js');
var path = require('path');
async = require("async");
var db = '';
var Promise = require('promise');

var helpers = '';
module.exports = class hospital_login_model extends Helper{

    constructor(){
        super();
        helpers = new Helper;
        db = new Database();
    }

async get_hospital_list(Illness,lat,long){
    try{
    var GivenIllneses=[]

       if(Illness!=''){
       // GivenIllneses = Illness.split(",").map(Number); 
       const[getAllIllness]= await db.db_connect.execute('select id from illnesses where is_deleted="0"');
       for(let z in getAllIllness){
           GivenIllneses.push(getAllIllness[z].id);
       
      }
       }else{
        const[getAllIllness]= await db.db_connect.execute('select id from illnesses where is_deleted="0"');
        for(let z in getAllIllness){
            GivenIllneses.push(getAllIllness[z].id);
        
       }
    }
    console.log(GivenIllneses,"============GivenIllneses");  
        let final_data='';
        var AllIlness=GivenIllneses.length;
        var totalIllness=(GivenIllneses.length - 1);
        var first =  true;
        for(let i in GivenIllneses){
            if(!first)
            {
                final_data+=" , ";
            }
            else
            {
                first  = false;
            }
          final_data+=" '"+GivenIllneses[i]+"'";
           
        /*   if( i < AllIlness){
             final_data+=" , ";
            } */
        }
        let final='';
        const[Details]= await db.db_connect.execute("SELECT sponser_login.id as sponser_id,sponser_login_id FROM sponser_illness LEFT join sponser_login ON sponser_login.id= sponser_illness.sponser_login_id WHERE  sponser_illness.illness_id IN ("+final_data+") and sponser_login.is_deleted=0 GROUP BY sponser_login_id HAVING count(*) ="+AllIlness);
    //    console.log("======>","SELECT sponser_login.id as sponser_id,sponser_login_id FROM sponser_illness LEFT join sponser_login ON sponser_login.id= sponser_illness.sponser_login_id WHERE  sponser_illness.illness_id IN ("+final_data+") and sponser_login.is_deleted=0 GROUP BY sponser_login_id HAVING count(*) ="+AllIlness);return false;
        /* const[Details]= await db.db_connect.execute("SELECT sponser_login_id FROM   sponser_illness WHERE  illness_id IN ("+final_data+") GROUP BY sponser_login_id HAVING count(*) = "+AllIlness); */
        //final=Details;
        console.log(Details,"=========Details");
        if(Details!=''){
         for(let i in Details){
            const[PolicyId]= await db.db_connect.execute('select id from policies where sponsorID=?',[Details[i].sponser_login_id]);
            //console.log(PolicyId,"===========PolicyId");return;
              for(let j in PolicyId){
                const[Hospital]= await db.db_connect.execute("select hospital_details.*,hospital_details.longitude,hospital_details.lat,(3959 * acos( cos( radians("+lat+") ) * cos( radians(hospital_details.lat ) ) * cos( radians( hospital_details.longitude ) - radians("+long+") ) + sin( radians("+lat+") ) * sin(radians(hospital_details.lat)) ) ) AS distance from hospital_details left join policy_hospital on hospital_details.id=policy_hospital.hospital_id  where policy_hospital.policy_id=? order by distance asc ",[PolicyId[j].id]);

                 console.log("select hospital_details.*,hospital_details.longitude,hospital_details.lat,(3959 * acos( cos( radians("+lat+") ) * cos( radians(hospital_details.lat ) ) * cos( radians( hospital_details.longitude ) - radians("+long+") ) + sin( radians("+lat+") ) * sin(radians(hospital_details.lat)) ) ) AS distance from hospital_details left join policy_hospital on hospital_details.id=policy_hospital.hospital_id  where policy_hospital.policy_id=? order by distance asc ",[PolicyId[j].id])
               console.log(Hospital,"============in model");
                //final=Hospital;
                return Hospital 
              }
         }
        }else{
            return final;
        }
       
      
    }catch(error){
        throw error;
    }
}
async save_hospital (data,image) {
     
    try{
        //console.log( data.country," data.country");return;
            var time = Date.now(); 
        const [row] = await db.db_connect.execute('SELECT *  FROM hospital_details WHERE `is_deleted` = ? and email=?', ['0',data.hospital_email]);
        //console.log(row != '',"============row");
        if(row != ''){
            
            var rows = 0;
            
           
        }else{
            let images = '';
            if(image!=''){
               
                images = super.image_Upload(image);
            }
            
            if(path.extname(images)){
                 images = images;
            }else{
                 images = ''
            }
            var time = Date.now(); 
            var digits = '0123456789'; 
            var password = ''; 
            for (let i = 0; i < 4; i++ ) { 
                password += digits[Math.floor(Math.random() * 10)]; 
            } 
            var hash= super.crypt(password);
            
           super.send_emailss(data.hospital_email,data.hospital_name,password);

           const [rows, fields] = await db.db_connect.execute('insert into hospital_details set  category_id=?,lat=?,longitude=?, name=?,email=?,image=?,password=?,address=?,city=?,state=?,country=?,zip=?,bank_name=?,account_number=?,holdername=?',[data.category_id,data.lat,data.long,data.hospital_name,data.hospital_email,images,hash,data.addreess,data.city,data.state,data.country,data.zip,data.bank_name,data.account_number,data.holder_name]);
           await helpers.sendHospitalNotification(data);
           

        }
        console.log(rows,"====================save hospital_details");
        return rows;
    }catch(err){
        throw err;
    }
    
}
async update_hospital (data,image,callback) {
    try{
        //let hash = super.crypt(data.hospital_password);
        var time = Date.now();
        let images = ''; 
        if(image!=''){
             images = super.image_Upload(image);
        }
        // console.log(images);return false;
        if(path.extname(images)){
             images = images;
        }else{
             images = ''
        }
        const [row, field] = await db.db_connect.execute('SELECT * FROM hospital_details WHERE `is_deleted` = ? and id=?', ['0',data.user_id]);
        if(images== ''){
            images = row[0].image;
         }
         const [rows, fields] = await db.db_connect.execute('UPDATE hospital_details  SET  category_id=?,lat=?,longitude=?, name = ?,image=?,email=?,address=?,lat=?,longitude=?,city=?,state=?,country=?,zip=?,modified=?,bank_name=?,account_number=?,holdername=? where id='+data.user_id+' ', [data.category_id,data.lat,data.long,data.hospital_name,images,data.hospital_email,data.addreess,data.lat,data.long,data.city,data.state,data.country,data.zip,time,data.bank_name,data.account_number,data.holder_name]);
         
         callback(rows);
    }catch(err){
        throw err;
    }
}
async get_hospital_detail(data,callback){
    try{
       const[EditDetails]= await db.db_connect.execute('select * from hospital_details where id=?',[data]);
   
    callback(EditDetails);
    }catch(err){
        throw err;
    }
}
async view_hospital_detail(data,callback){
    try{
        const[Details]= await db.db_connect.execute('select * from hospital_details where id=?',[data]);
    callback(Details);
    }catch(err){
        throw err;
    }
}
async updateStatus(data,callback){
    try{
     
     const[row]= await db.db_connect.execute('update hospital_details set status=? where id=?',[data.status,data.id]);
    console.log(row);
    callback(row);
    }catch(e){
        throw e;
    }
 }
 async get_hospital_lists(){
     try{
       const[Result]= await db.db_connect.execute('select  category.name as catname,hospital_details.* from hospital_details  left join category on hospital_details.category_id = category.id where is_deleted=? order by id desc',[0]);
       console.log(Result,"=======================catname");
     return Result;
     }catch(err){
         throw err;
     }
 }
}