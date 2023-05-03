var Helper = require('../../config/helper');
var  Database = require('../../config/database.js');
async = require("async");
var path = require('path');
//var FCM = require('fcm-node');
var db = '';
module.exports = class claimlist_model extends Helper{

    constructor(){
        super();
        db = new Database();
    }
	async claim_list(data,callback){
		try{
            // const[rows]=await db.db_connect.execute("select claim_list.amount,claim_list.varify_status,claim_list.redeem_status,illnesses.name,hospital_login.username as hospital_name,claim_list.id ,policies.name as policy_name ,users.username,illnesses.name as illnesse_name, claim_list.policyNumber as policy_number,claim_list.no_claim from claim_list left join users on claim_list.user_id=users.id left JOIN illnesses on claim_list.illness_id=illnesses.id left join policies on claim_list.policy_id=policies.id left join hospital_login on hospital_login.id=claim_list.hospital_id where claim_list.sponser_id=?",[data]);
            const[rows]=await db.db_connect.execute("select  users.id as userId,claim_list_illness.policy_number as policy_number,claim_list.amount,claim_list.varify_status,claim_list.redeem_status,hospital_details.name as hospital_name,claim_list.id as claimId,policies.name as policy_name ,users.username from claim_list left join users on claim_list.user_id=users.id left join policies on claim_list.policy_id=policies.id left join hospital_details on hospital_details.id=claim_list.hospital_id left JOIN claim_list_illness on claim_list.id=claim_list_illness.claim_request_id where claim_list.sponser_id=? group by claim_list_illness.policy_number ",[data]);
           
            if(rows.length>0){
                for(let i in rows){
                    let all= 4;
                    let userId= rows[i].userId;
                    let claimId= rows[i].claimId;
                const[getused]= await db.db_connect.execute('select count(id)as usedPolicy from users_policy_history where user_id=? and claim_id=?',[userId,claimId]);
                for(let j in getused){
                let unused= all-getused[j].usedPolicy;
                
                    rows[i].unused=unused;
                    rows[i].used=getused[j].usedPolicy;
                }
                
            } 
        }
           
            callback(rows);
		}catch(err){
			throw err;
		}

	}

	async get_detail (session,callback){
		try{
			const[rows] = await db.db_connect.execute('SELECT hl.id,hl.username from sponsor_hospitals  as sh  JOIN hospital_login as hl ON hl.id = sh.hospital_id where hl.is_deleted="0"');
			const[row] = await db.db_connect.execute('SELECT id,name from policies where is_deleted="0"');
			const[r]  = await db.db_connect.execute('SELECT id,username from users where is_deleted="0"');
			let details = {
				hospitals:rows,
				policies:row,
				users:r
			}
			console.log(details);
			callback(details);
		}catch(err){
			throw err;
		}
	}
	async save_claim (data,callback) {
        try{
        	let rowss = '';
        	var time = super.time(); 
            const[r] = await db.db_connect.execute('SELECT * from claim_list where hospital_id=? && policy_id=? && user_id=? && date=?',[data.hospital_name,data.policy_name,data.username,data.date]);
            if(r!=''){
            	const[row] = await db.db_connect.execute(`update claim_list set no_claim=${r[0].no_claim+1},otp="${data.otp}" where id=${r[0].id}`);
            	rowss = row;
            }else{
            const [rows, fields] = await db.db_connect.execute('insert into claim_list set hospital_id=?,policy_id=?,user_id=?,otp=?,date=?,illness_id=?',[data.hospital_name,data.policy_name,data.username,data.otp,data.date,data.illness_name]);
            rowss = rows;
            }
          callback(rowss); 
        }catch(err){
            throw err;
        }
    }
      async claim_edit (data,callback){
        try{
            const[row] = await db.db_connect.execute('select * from claim_list  WHERE id=?',[data]);
            if(row!=''){
                const[get_illness] = await db.db_connect.execute('select id,name from illnesses where id=?',[row[0].illness_id]);
                row[0].illness_id = get_illness[0];
            }
            callback(row);
        }catch(err){
            throw err; 
        }
    }
    async update_claim_details(data,callback){
        try{
           const [rows, fields] = await db.db_connect.execute('update claim_list set hospital_id=?,policy_id=?,user_id=?,otp=?,date=?,illness_id=? where id=?',[data.hospital_name,data.policy_name,data.username,data.otp,data.date,data.user_id,data.illness_name]);
          callback(rows);
        }catch(err){
            throw err;
        }
    }
     async view_claim(data,callback){
        try{
            const [rows]=await db.db_connect.execute("SELECT cl.id, cl.otp,cl.date,cl.no_claim,IFNULL(hl.username,'') as h_name,IFNULL(p.name,'') as p_name,IFNULL(u.username,'') as u_name from claim_list as cl LEFT JOIN hospital_login as hl ON hl.id = cl.hospital_id LEFT JOIN policies as p ON p.id = cl.policy_id LEFT JOIN users as u ON u.id = cl.user_id where cl.is_deleted =0 AND cl.id=? ORDER BY cl.id DESC",[data]);
            callback(rows);
        }catch(err){
            throw err;
        }
     }

     async get_illness_ids (data){
         try{
            const[get_illness_ids] = await db.db_connect.execute('select * from policies where id=?',[data]);
            if(get_illness_ids[0].illness_id!=''){
                let illness_id = JSON.parse(get_illness_ids[0].illness_id);
                const[get_illness_name] = await db.db_connect.execute('select id,name from illnesses where id IN('+illness_id+')');
                return get_illness_name;
            }else{
                return false;
            }
         }catch(err){
             throw err;
         }
     }
async policy_generation(data,headers){
    try{
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        var NextYear = new Date(d-month-year+1);
    
       let final_user=''
       let Users='';
       let Policy_code=''
        
       if(data.child_id =='' ||data.child_id =='null'||data.child_id ==undefined){
           console.log("in if");
           const[UserId]= await db.db_connect.execute('select * from users where authorization_key=?',[headers.auth_key]);
           Users=UserId

             /////////////GeneratePolivy Number For Parent//////////
            
             var year= new Date().getFullYear()
             var user =Users[0].username
              var UsersCode= user.substring(0, 2);
              var name= UsersCode.toUpperCase();
             var code =  Math.floor(100000 + Math.random() * 9000);
             var Policy=(name+"/"+year+"/"+code);
             Policy_code=Policy
           /////////////////////////////////////////////////////

           final_user=UserId[0].id
        //   console.log(final_user,"======check");
        //   return ;
        
       }else{
            const[UserId]= await db.db_connect.execute('select * from users where id=?',[data.child_id]);
            Users=UserId

            
             /////////////GeneratePolicy Number For Child//////////
            
             var year= new Date().getFullYear()
             var user =Users[0].username
              var UsersCode= user.substring(0, 2);
              var name= UsersCode.toUpperCase();
              var nick= "CH";
             var code =  Math.floor(100000 + Math.random() * 9000);
             var Policy=(nick+"/"+name+"/"+year+"/"+code);
             Policy_code=Policy
           /////////////////////////////////////////////////////
           final_user=UserId[0].id
       }
      
        ///////// genrate policy number////
        let Final_code=''
        let checkSponser=''

         
        // first time policy
        if(data.type==1){
           checkSponser=0;
           
           Final_code=Policy_code
        }else{
           
           let user='';
           if(!data.child_id){
            const[users]= await db.db_connect.execute('select id from users where authorization_key=?',[headers.auth_key]);
            user=users;
           }else{
            const[users]= await db.db_connect.execute('select id from users where id=?',[data.child_id]);
            user=users;
           }

           
           
           const[result]= await db.db_connect.execute('SELECT DISTINCT(claim_list_illness.policy_number),claim_list.sponser_id from claim_list LEFT JOIN claim_list_illness ON claim_list_illness.claim_request_id=claim_list.id where claim_list.user_id=?',[user[0].id])

          
           const[last_sponser]=await db.db_connect.execute('select * from claim_list where user_id="'+user[0].id+'" order by id desc');
           checkSponser=last_sponser[0].sponser_id;
           Final_code=result[0].policy_number
        }
        
        var sponserToGive=0;
        
        ///
        var Illneses=[]

        if(data.illness_ids !=''){
           // Illneses =  data.illness_ids.split(",").map(Number);  
           const[getAllIllness]= await db.db_connect.execute('select id from illnesses where is_deleted="0"');
         for(let z in getAllIllness){
            Illneses.push(getAllIllness[z].id);
         }
        }else{
         const[getAllIllness]= await db.db_connect.execute('select id from illnesses where is_deleted="0"');
         for(let z in getAllIllness){
            Illneses.push(getAllIllness[z].id);
         
        }
     }
        //?
        
     
       // console.log(Illneses,"============Illneses");return false;
        let final_data='';
        var AllIlness=Illneses.length;
        var totalIllness=(Illneses.length - 1);
        var first =  true;
        for(let i in Illneses){
            if(!first)
            {
                final_data+=" , ";
            }
            else
            {
                first  = false;
            }
          final_data+=" '"+Illneses[i]+"'";
           
         
        }

        // Check if free sponsers available
        const[getActiveSponsers]=await db.db_connect.execute('select * from policies where is_deleted="0" and expiry_date>now()');
       // console.log(getActiveSponsers,"============getActiveSponsers");return false;
        var NxtSponser=0;
        if(checkSponser==0){
             var query="SELECT policies.id,sponser_login.id as sponser_id ,sponser_login_id FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id LEFT JOIN policies ON policies.sponsorID=sponser_login.id WHERE sponser_login.type='1'and  sponser_illness.illness_id IN ("+final_data+") and sponser_login.is_deleted= 0  and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1  GROUP BY sponser_login_id HAVING count(*) = "+AllIlness;
          
            
            var [getFreeSponser]=await db.db_connect.execute(query);
           
            if(getFreeSponser && getFreeSponser[0] && getFreeSponser[0].sponser_id){
                NxtSponser=getFreeSponser[0].sponser_id;
            }
            else{
                return [{message:'Free Sponser Not Available',error:true,code:410}];
            }
        }
        else{

            // Get Next Sponser to Last Policy Sponser
            var query="SELECT  sponser_login.id as sponser_id ,sponser_login_id FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id LEFT JOIN policies ON policies.sponsorID=sponser_login.id WHERE sponser_login.id >  '"+checkSponser+"' and sponser_login.type='1'  and   sponser_illness.illness_id IN ("+final_data+") and sponser_login.is_deleted= 0 and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1 GROUP BY sponser_login_id HAVING count(*) = "+AllIlness;
            //console.log(query,"================query");return  false;
            
            var [getNextToLastPolicySponser] = await db.db_connect.execute(query);
            if (getNextToLastPolicySponser && getNextToLastPolicySponser[0] && getNextToLastPolicySponser[0].sponser_id){
                NxtSponser=getNextToLastPolicySponser[0].sponser_id;
            }
            else{
                // Check Free Again
                var query2="SELECT  sponser_login.id as sponser_id ,sponser_login_id FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id LEFT JOIN policies ON policies.sponsorID=sponser_login.id WHERE sponser_login.type='1' and  sponser_illness.illness_id IN ("+final_data+") and sponser_login.is_deleted= 0  and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1  GROUP BY sponser_login_id HAVING count(*) = "+AllIlness;
                var [getFreeSponser]=await db.db_connect.execute(query2);
                if(getFreeSponser && getFreeSponser[0] && getFreeSponser[0].sponser_id){
                    NxtSponser=getFreeSponser[0].sponser_id;
                }else{
                    return [{message:'Free Sponser Not Available',error:true,code:410}];
                }
            }
        }

        let newData='';
        var getSponserQuery="SELECT sponser_login.id as sponser_id , sponser_login_id ,policies.id,policies.expiry_date FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id left join policies on policies.sponsorID=policies.id WHERE sponser_login.id='"+NxtSponser+"'";
        const[AllotedSponser]= await db.db_connect.execute(getSponserQuery);
        //console.log(AllotedSponser,"=====================getSponserQuery");return false;
        if(AllotedSponser){
       
        
        const[PolicyId]= await db.db_connect.execute('select id from policies where sponsorID=?',[AllotedSponser[0].sponser_login_id]);
       
        const[InsertClaim]= await db.db_connect.execute('insert into claim_list set sponser_id=?,hospital_id=?,user_id=?,policy_id=?,payment_status=?',[AllotedSponser[0].sponser_login_id,data.hospital_id,final_user,PolicyId[0].id,0]);
        
       
         var start = Math.floor(Date.now() / 1000)
          var nextYear=start+3.154e+7;
         let  q =  "";
            let  first =  true;
             for (let i in Illneses)
             {
                
                 if(first)
                 {
                     first =  false;
                 }
                 else
                 {
                     q += ",";  
                 }
                 q += "("+InsertClaim.insertId+","+Illneses[i]+",'"+Final_code+"','"+nextYear+"','"+start+"')";
            } 
             const[SaveSeparateIll_id]= await db.db_connect.execute("INSERT INTO claim_list_illness (claim_request_id,illness_id,policy_number,expiry_date,claim_date) VALUES "+q);

             const[Details]= await db.db_connect.execute('select  claim_request_id,policy_number,message from claim_list_illness left join claim_list on claim_list.id= claim_list_illness.claim_request_id where claim_list_illness.id=?',[SaveSeparateIll_id.insertId]);
            // let countIllness= SaveSeparateIll_id.affectedRows
             let countIllness= 1
             const[TotalIll]= await db.db_connect.execute('select policy_left from policies where sponsorID=?',[AllotedSponser[0].sponser_login_id]);
             
             var remaining=TotalIll[0].policy_left-countIllness;
             
            var getSponserFinal = "SELECT id,username,sponser_message FROM sponser_login WHERE id= " +AllotedSponser[0].sponser_login_id;
            const [sponserDataFinal] = await db.db_connect.execute(getSponserFinal);
            //console.log(sponserDataFinal[0],"sponserDataFinal");
             const[UpdateReamingPolicy]= await db.db_connect.execute('update policies set policy_left=? where sponsorID=?',[remaining,AllotedSponser[0].sponser_login_id]);
             //console.log(UpdateReamingPolicy,'UpdateReamingPolicy');
            if (sponserDataFinal && sponserDataFinal[0] && sponserDataFinal[0].sponser_message){
                Details[0].message = sponserDataFinal[0].sponser_message;
                Details[0].username = sponserDataFinal[0].username;
             }

             await db.db_connect.execute("INSERT into user_used_free_sponsers(user_id,sponser_id) values('"+final_user+"','"+AllotedSponser[0].sponser_login_id+"')");

             return Details;
        }else{
            return [{message:'Sponser Not Found',error:true,code:410}];
        }
       /*  }else{
            return 0;
        } */ 
    }catch(err){
        throw err;
    }
}
async paid_genrate_policy(data,headers){
    try{
        
        var start = Math.floor(Date.now() / 1000)
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        var day = d.getDate();
        var NextYear = new Date(d-month-year+1);
    
       let final_user=''
       let Users='';
       let Policy_code=''
   
       if(data.child_id =='' ||data.child_id =='null'||data.child_id ==undefined){
           console.log("in if");
           const[UserId]= await db.db_connect.execute('select * from users where authorization_key=?',[headers.auth_key]);
           Users=UserId

             /////////////GeneratePolivy Number For Parent//////////
            
             var year= new Date().getFullYear()
             var user =Users[0].username
              var UsersCode= user.substring(0, 2);
              var name= UsersCode.toUpperCase();
             var code =  Math.floor(100000 + Math.random() * 9000);
             var Policy=(name+"/"+year+"/"+code);
             Policy_code=Policy
           /////////////////////////////////////////////////////

           final_user=UserId[0].id
        //   console.log(final_user,"======check");
        //   return ;
        
       }else{
            const[UserId]= await db.db_connect.execute('select * from users where id=?',[data.child_id]);
            Users=UserId

            
             /////////////GeneratePolicy Number For Child//////////
            
             var year= new Date().getFullYear()
             var user =Users[0].username
              var UsersCode= user.substring(0, 2);
              var name= UsersCode.toUpperCase();
              var nick= "CH";
             var code =  Math.floor(100000 + Math.random() * 9000);
             var Policy=(nick+"/"+name+"/"+year+"/"+code);
             Policy_code=Policy
           /////////////////////////////////////////////////////
           final_user=UserId[0].id
       }
    
        ///////// genrate policy number////
        let Final_code=''
        let checkSponser=''

         
        // first time policy
        if(data.type==1){
           checkSponser=0;
           
           Final_code=Policy_code
        }else{
           
           let user='';
           if(!data.child_id){
            const[users]= await db.db_connect.execute('select id from users where authorization_key=?',[headers.auth_key]);
            user=users;
           }else{
            const[users]= await db.db_connect.execute('select id from users where id=?',[data.child_id]);
            user=users;
           }

           const[result]= await db.db_connect.execute('SELECT DISTINCT(claim_list_illness.policy_number),claim_list.sponser_id from claim_list LEFT JOIN claim_list_illness ON claim_list_illness.claim_request_id=claim_list.id where claim_list.user_id=?',[user[0].id])
           const[last_sponser]=await db.db_connect.execute('select * from claim_list where user_id="'+user[0].id+'" order by id desc');
           checkSponser=last_sponser[0].sponser_id;
          // const[CheckExistSPo]= await db.db_connect.execute('select id from sponser_login where id=? and is_deleted=?',[checkSponser,0]);
           Final_code=result[0].policy_number
        }
        
        var sponserToGive=0;
        var Illneses=[]

        if(data.illness_ids !=''){
           // Illneses =  data.illness_ids.split(",").map(Number);  
           const[getAllIllness]= await db.db_connect.execute('select id from illnesses where is_deleted="0"');
         for(let z in getAllIllness){
            Illneses.push(getAllIllness[z].id);
         }
        }else{
         const[getAllIllness]= await db.db_connect.execute('select id from illnesses where is_deleted="0"');
         for(let z in getAllIllness){
            Illneses.push(getAllIllness[z].id);
         
        }
     }
       // console.log(Illneses,"==========Illneses");return false;
       // var Illneses =  data.illness_ids.split(","); 
        let final_data='';
        var AllIlness=Illneses.length;
        var totalIllness=(Illneses.length - 1);
        var first =  true;
        for(let i in Illneses){
            if(!first)
            {
                final_data+=" , ";
            }
            else
            {
                first  = false;
            }
          final_data+=" '"+Illneses[i]+"'";
           
         
        }

        // Check if paid sponsers available
        var NxtSponser=0;
        if(checkSponser==0){
            var query="SELECT  sponser_login.id as sponser_id ,sponser_login_id FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id LEFT JOIN policies ON policies.sponsorID=sponser_login.id WHERE sponser_login.type='2'   and  sponser_illness.illness_id IN ("+final_data+") and sponser_login.is_deleted= 0 and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1 GROUP BY sponser_login_id HAVING count(*) = "+AllIlness;
            var [getFreeSponser]=await db.db_connect.execute(query);
            //console.log(getFreeSponser);
            if(getFreeSponser && getFreeSponser[0] && getFreeSponser[0].sponser_id){
                NxtSponser=getFreeSponser[0].sponser_id;
            }
            else{
                return [{message:'No DUC ID Available At This Time.',error:true,code:411}];
            }
        }
        else{

            // Get Next Sponser to Last Policy Sponser
            var query="SELECT  sponser_login.id as sponser_id ,sponser_login_id FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id LEFT JOIN policies ON policies.sponsorID=sponser_login.id WHERE sponser_login.id >  '"+checkSponser+"' and sponser_login.type='2' and sponser_illness.illness_id IN ("+final_data+") and sponser_login.is_deleted= 0 and policies.expiry_date>= date(now()) and policies.policy_left>=1 GROUP BY sponser_login_id HAVING count(*) = "+AllIlness;
            var [getNextToLastPolicySponser] = await db.db_connect.execute(query);
            if (getNextToLastPolicySponser && getNextToLastPolicySponser[0] && getNextToLastPolicySponser[0].sponser_id){
                NxtSponser=getNextToLastPolicySponser[0].sponser_id;
            }
            else{
                // Check paid Again
                var query2="SELECT  sponser_login.id as sponser_id ,sponser_login_id FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id LEFT JOIN policies ON policies.sponsorID=sponser_login.id WHERE sponser_login.type='2'  and  sponser_illness.illness_id IN ("+final_data+") and sponser_login.is_deleted= 0  and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1  GROUP BY sponser_login_id HAVING count(*) = "+AllIlness;
                var [getFreeSponser]=await db.db_connect.execute(query2);
                if(getFreeSponser && getFreeSponser[0] && getFreeSponser[0].sponser_id){
                    NxtSponser=getFreeSponser[0].sponser_id;
                }else{
                    return [{message:'No DUC ID Available At This Time.',error:true,code:411 }];
                }
            }
        }

        

        let newData='';
        var getSponserQuery="SELECT sponser_login.id as sponser_id , sponser_login_id FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id  WHERE sponser_login.id='"+NxtSponser+"'";
        const[AllotedSponser]= await db.db_connect.execute(getSponserQuery);
        if(AllotedSponser){
            
        const[PolicyId]= await db.db_connect.execute('select id from policies where sponsorID=?',[AllotedSponser[0].sponser_login_id]);

        //console.log(PolicyId[0].id,'PolictID');return false;
        const[InsertClaim]= await db.db_connect.execute('insert into claim_list set sponser_id=?,hospital_id=?,user_id=?,policy_id=?,payment_status=?',[AllotedSponser[0].sponser_login_id,data.hospital_id,final_user,PolicyId[0].id,1]);
        
       
         var start = Math.floor(Date.now() / 1000)
          var nextYear=start+3.154e+7;
         let  q =  "";
            let  first =  true;
             for (let i in Illneses)
             {
                
                 if(first)
                 {
                     first =  false;
                 }
                 else
                 {
                     q += ",";  
                 }
                 q += "("+InsertClaim.insertId+","+Illneses[i]+",'"+Final_code+"','"+nextYear+"')";
            } 
             const[SaveSeparateIll_id]= await db.db_connect.execute("INSERT INTO claim_list_illness (claim_request_id,illness_id,policy_number,expiry_date) VALUES "+q);

             const[Details]= await db.db_connect.execute('select  claim_request_id,policy_number,message from claim_list_illness left join claim_list on claim_list.id= claim_list_illness.claim_request_id where claim_list_illness.id=?',[SaveSeparateIll_id.insertId]);
             let countIllness= 1
             
             const[TotalIll]= await db.db_connect.execute('select policy_left from policies where sponsorID=?',[AllotedSponser[0].sponser_login_id]);
             
             var remaining=TotalIll[0].policy_left-countIllness;
             
            var getSponserFinal = "SELECT id,username, sponser_message FROM sponser_login WHERE id= " +AllotedSponser[0].sponser_login_id;
            const [sponserDataFinal] = await db.db_connect.execute(getSponserFinal);
            //console.log(sponserDataFinal[0],"sponserDataFinal");
             const[UpdateReamingPolicy]= await db.db_connect.execute('update policies set policy_left=? where sponsorID=?',[remaining,AllotedSponser[0].sponser_login_id]);

             const[InsertValue]= await db.db_connect.execute('insert into transaction_history set user_id=?,claim_id=?,transaction_id=?,created=?,modified=?',[final_user,InsertClaim.insertId,data.transaction_id,start,start]);
          
            if (sponserDataFinal && sponserDataFinal[0] && sponserDataFinal[0].sponser_message){
                Details[0].message = sponserDataFinal[0].sponser_message;
                Details[0].username = sponserDataFinal[0].username;
             }
             return Details;
        }else{
            return [{message:' Sponser Not Found',error:true,code:411}];
        }
       /*  }else{
            return 0;
        } */
    }catch(err){
        throw err;
    }
}
async hospital_change(header,data,lat,long,countyname){
    try{
       
       // console.log(lat,long,countyname,"++++++++++==");return false;
        /* console.log(data.child_id =='' ||data.child_id =='null'||data.child_id ==undefined,'checking');
        console.log(data.child_id);return false; */
        let final_user=''
        if(data.child_id =='' ||data.child_id =='null'||data.child_id ==undefined){
            console.log("in parent");
            const[UserId]= await db.db_connect.execute('select * from users where id=?',[header]);
           // Users=UserId
             final_user=UserId[0].id
        }else{
             const[UserId]= await db.db_connect.execute('select * from users where id=?',[data.child_id]);
             //Users=UserId
             final_user=UserId[0].id
        }
        const[userClaim]= await db.db_connect.execute('select * from claim_list where user_id=? order by id asc limit 1',[final_user]);
        
        const CheckIllness= await db.db_connect.execute('select cli.illness_id from claim_list_illness as cli left JOIN claim_list ON claim_list.id=cli.claim_request_id where claim_list.user_id=? and claim_list.id=?',[final_user,userClaim[0].id]);
         
         var AllIllness=[];
         for(var i in CheckIllness){
             var chkIllness=CheckIllness[i];
             //console.log(CheckIllness,"===============CheckIllness");return false;
            for(var j in chkIllness){
                if(chkIllness[j].illness_id){
                    AllIllness.push(chkIllness[j].illness_id);
                }
            }
        }
            var final_data="";
            var first =  true;
        for(let k in AllIllness){
            if(!first)
            {
                final_data+=" , ";
            }
            else
            {
                first  = false;
            }
          final_data+=" '"+AllIllness[k]+"'";
        }
        var AllIlness=AllIllness.length;
        let [getSponsers]= await db.db_connect.execute("SELECT sponser_login_id FROM   sponser_illness WHERE  illness_id IN ("+final_data+") GROUP BY sponser_login_id HAVING count(*) = "+AllIlness);
        
        
        /* var Allsponsers=[];
        for(var sp in getSponsers){
            Allsponsers.push(getSponsers[sp].sponser_login_id);
        }   
        console.log(Allsponsers); */
        let final=''
        if(getSponsers!=''){
            for(let i in getSponsers){

              const[PolicyId]= await db.db_connect.execute('select id from policies where sponsorID=?',[getSponsers[i].sponser_login_id]);
             
                 for(let j in PolicyId){
                     console.log(countyname==undefined|| countyname=='',countyname,"=========check");
                 if(countyname==undefined|| countyname==''){
                    console.log("in if");
                    const[Hospital]= await db.db_connect.execute("select hospital_details.*,hospital_details.longitude,hospital_details.lat,(3959 * acos( cos( radians("+lat+") ) * cos( radians(hospital_details.lat ) ) * cos( radians( hospital_details.longitude ) - radians("+long+") ) + sin( radians("+lat+") ) * sin(radians(hospital_details.lat)) ) ) AS distance from hospital_details left join policy_hospital on hospital_details.id=policy_hospital.hospital_id  where policy_hospital.policy_id=? order by distance asc ",[PolicyId[j].id]);

                    console.log("select hospital_details.*,hospital_details.longitude,hospital_details.lat,(3959 * acos( cos( radians("+lat+") ) * cos( radians(hospital_details.lat ) ) * cos( radians( hospital_details.longitude ) - radians("+long+") ) + sin( radians("+lat+") ) * sin(radians(hospital_details.lat)) ) ) AS distance from hospital_details left join policy_hospital on hospital_details.id=policy_hospital.hospital_id  where policy_hospital.policy_id=? order by distance asc ",[PolicyId[j].id]);
                     /* const[Hospital]= await db.db_connect.execute('select * from hospital_details left join  policy_hospital on hospital_details.id=policy_hospital.hospital_id where policy_hospital.policy_id=?',[PolicyId[j].id]); */
                      console.log(Hospital.length,'Hospital');
                      final=Hospital;
                 }else{

                    console.log(countyname,"===========coming here")
                    //  const[Hospital]= await db.db_connect.execute("select hospital_details.*,from hospital_details left join policy_hospital on hospital_details.id=policy_hospital.hospital_id  where policy_hospital.policy_id=? and country LIKE '"+countyname+"%' order by hospital_details.id asc",[PolicyId[j].id]);
                    //  console.log(Hospital,'Hospital');return false;
                    const[Hospital]= await db.db_connect.execute("select hospital_details.* from hospital_details left join policy_hospital on hospital_details.id=policy_hospital.hospital_id where policy_hospital.policy_id=? and country LIKE '"+countyname+"%' order by hospital_details.id asc",[PolicyId[j].id]);
                   
                     final=Hospital;
                 }
                 }
            }
           }
        return final;
      
    }catch(err){
        throw err;
    }
}
async checkIllness(data,header){
    try{
        //console.log(data);return false;
        var illness= (parseInt(data.illness_id,10))
       /*  const[User]= await db.db_connect.execute('select id from users where authorization_key=?',[header.auth_key]); */
      /*  console.log('SELECT  claim_list.hospital_id,claim_list_illness.illness_id FROM claim_list_illness LEFT JOIN claim_list on claim_list_illness.claim_request_id=claim_list.id  WHERE claim_list.user_id=? && claim_list_illness.illness_id=?',[data.UserId,illness]); */
      
       const[CheckIll]= await db.db_connect.execute('SELECT  claim_list.hospital_id,claim_list_illness.illness_id FROM claim_list_illness LEFT JOIN claim_list on claim_list_illness.claim_request_id=claim_list.id  WHERE claim_list.user_id=?',[data.UserId]);
       return CheckIll;
    }catch(err){
        throw err;
    }
}
async get_hospital(UserId){
    try{
        //console.log('select  id,name from hospital_details where id=?',[UserId],'Result');
        const[Result]= await db.db_connect.execute('select  id,name from hospital_details where id=?',[UserId])
        return Result
    }catch(error){
        throw error;
    }
}
async checkIllness_child(data,header){
    try{
        var illness= (parseInt(data.illness_id,10))
        const[Child]= await db.db_connect.execute('select id from users where authorization_key=?',[header]);
        

       const[CheckIll]= await db.db_connect.execute('SELECT claim_list_illness.illness_id FROM claim_list_illness LEFT JOIN claim_list on claim_list_illness.claim_request_id=claim_list.id  WHERE claim_list.user_id=? && claim_list_illness.illness_id=?',[Child[0].id,illness]);
       
       return CheckIll;
    }catch(err){
        throw err;
    }
}
async unique_code(checkuser,data,header,Hospitals,remaining,AllIllness,allMyPolicy){
    try{
    
        var Now=Math.floor(Date.now() / 1000);
      
    let final_data='';
    
   // if(CheckExistingOtp[0].otp == ''){
        var digits = '0123456789'; 
        var otp = '';
        for (let i = 0; i < 4; i++ ) { 
            otp += digits[Math.floor(Math.random() * 10)]; 
        }
     
        const[Result]= await db.db_connect.execute("SELECT claim_list.user_id,claim_list_illness.claim_request_id, claim_list_illness.id FROM `claim_list` inner join claim_list_illness on claim_list_illness.claim_request_id=claim_list.id  and claim_list.user_id=? and CAST(expiry_date AS UNSIGNED) > ?",[data.UserId,Now]);
       // console.log(Result,'Result');return false;
       const[MaxIllness]= await db.db_connect.execute('select ill_range from illness_range');
       let MaximumIll=MaxIllness[0].ill_range;
    
       const[OtpAlreadyGen]= await db.db_connect.execute('select count(policy_otp_status.id) as otp_count from policy_otp_status where claim_id=? and user_id=?',[allMyPolicy.claim_request_id,allMyPolicy.user_id]);
     
       let otpgen= OtpAlreadyGen[0].otp_count;

        let reminingToGenerate =  AllIllness - remaining

       console.log(reminingToGenerate,reminingToGenerate>0,"============>remining to be");
       if(reminingToGenerate>0){
       const[updateOtp]= await db.db_connect.execute('insert into policy_otp_status set claim_id=?,user_id=?,otp=?',[allMyPolicy.claim_request_id,allMyPolicy.user_id,otp]);
       console.log(updateOtp,"========================updateOtp");
       /* console.log("UPDATE claim_list_illness set otp_gen_time=?,otp_status=?WHERE claim_request_id=?",[Now,1,Result[0].claim_request_id]); */
        const[Insert]= await db.db_connect.execute("UPDATE claim_list_illness set otp_gen_time=?,otp_status=? where  claim_request_id =?",[Now,1,allMyPolicy.claim_request_id]); 

       /*  console.log('select otp_gen_time from claim_list_illness where id=?',[Result[0].id]);
        const[Updated]= await db.db_connect.execute('select otp_gen_time from claim_list_illness where id=?',[Result[0].id]); */

        ///////////////integrating Push Notification after 2 hours//////////
        //var PushTime= Now+4*3600*1000;
        final_data=otp
       }else{
        final_data=''; 
       }
      
   // }
        return final_data;
    }catch(err){
        throw err;
    }
}
async check_auths_child(data,header){
    try{
    let final_data=''
    const[User]= await db.db_connect.execute('select * from users where authorization_key=?',[header]);
    if(User!=''){
    const[Child]= await db.db_connect.execute('select * from users where is_parent=? && id=?',[User[0].id,data.child_ids]);
    final_data=Child
    }
    return final_data;
    }catch(e){
        throw e;
    }
}
async update_hospital(formData,parentId){
    try{
        let final_user=''
        if(formData.child_id =='' ||formData.child_id=='null'||formData.child_id ==undefined){
            console.log("in parent");
            const[UserId]= await db.db_connect.execute('select * from users where id=?',[parentId]);
           // Users=UserId
             final_user=UserId[0].id
        }else{
             const[UserId]= await db.db_connect.execute('select * from users where id=?',[formData.child_id]);
             console.log("in child");
             final_user=UserId[0].id
        } 
        const[GetDetails]= await db.db_connect.execute('select * from claim_list where user_id=?',[final_user]);
         //console.log(GetDetails);return false;
         let count=GetDetails[0].hospital_count;
         //console.log(count,"=======>count");return false;
         let final_data='';
         console.log(count<=8,'count');
        if(count<=8){
            console.log("in if");
              var m = count+1;``
            
            const[Result]= await db.db_connect.execute('update claim_list set hospital_id=? ,hospital_count=? where user_id=?',[formData.hospital_id,m,final_user]);
            console.log(Result,"===>updating");
            if(Result.affectedRows>=1){
                final_data=Result; 
            }else{
                final_data=''; 
            } 
        }
        console.log(final_data,'final_data');
        return final_data;
       
    }catch(error){
        throw error;
    }
}
async get_unique_claimId(data){
    try{

    let final_data=''
       const[result]= await db.db_connect.execute('select id from claim_list where user_id=?',[data]);
       if(result!=''){
        final_data=result;
       }
   
    return final_data;
    }catch(err){
        throw error;
    }
}
async get_Users_illneses(UserId,ClaimId) {
    try {
       /*  const [row] = await db.db_connect.execute('SELECT illnesses.id,illnesses.name,illnesses.description from  illnesses LEFT JOIN claim_list_illness ON claim_list_illness.illness_id=illnesses.id LEFT JOIN claim_list ON claim_list.id=claim_list_illness.claim_request_id where claim_list.user_id=? ',[UserId]); */
        const [Details] = await db.db_connect.execute('SELECT claim_list.hospital_id,hospital_details.name from  illnesses LEFT JOIN claim_list_illness ON claim_list_illness.illness_id=illnesses.id LEFT JOIN claim_list ON claim_list.id=claim_list_illness.claim_request_id LEFT JOIN hospital_details ON hospital_details.id=claim_list.hospital_id where claim_list.user_id=? group by claim_list.hospital_id order by claim_list.id desc',[UserId]);
      

       var response=[]; 
            for (var i in Details){
                
                var [getDetails]= await db.db_connect.execute('SELECT illnesses.id,illnesses.name,illnesses.description from  illnesses LEFT JOIN claim_list_illness ON claim_list_illness.illness_id=illnesses.id LEFT JOIN claim_list ON claim_list.id=claim_list_illness.claim_request_id where claim_list.user_id=? and claim_list.hospital_id=? ', [UserId, Details[i].hospital_id]);
                Details[i].policy_details = getDetails;
                response.push(Details);
     }  
        return response;
    } catch (err) {
        throw err;
    }
}
async getIllness_Count(UserId){
    try{
        // const[allIll]= await db.db_connect.execute('SELECT illnesses.id,illnesses.name,illnesses.description from  illnesses LEFT JOIN claim_list_illness ON claim_list_illness.illness_id=illnesses.id LEFT JOIN claim_list ON claim_list.id=claim_list_illness.claim_request_id where claim_list.user_id=?',[UserId]);
        // var count=allIll.length
        const[policyDetails]= await db.db_connect.execute('select count(*) as total from claim_list where user_id=?',[UserId]);
      
        if(policyDetails[0].total ==0){
            var count=0
        }else{
    
            const[allIll]= await db.db_connect.execute('select ill_range from illness_range ');
            var count=allIll[0].ill_range * policyDetails[0].total;
        }
        
        return count
    }catch(err){
        throw err;
    }
}
async get_otpCount(claim_id){
    try{
        let final_data='';
        if(claim_id!==0 && claim_id!==''){

        //let final=''
        const[Otpstatus]= await db.db_connect.execute('select count(otp) as optCount from claim_list_illness where claim_list_illness.claim_request_id=? and otp != ""',[claim_id])
        /* if(Otpstatus==''){
           final=0
        }else{
            final= Otpstatus
        } */
        final_data =Otpstatus[0].optCount;
    //console.log(final,'Otpstatus');return false;
    }else{
        final_data=0
    }
    console.log(final_data,'final_data');
    return final_data;
    }catch(err){
        throw err;
    }
}
async update_policy(data/* ,users */){
    try{
        console.log("in update policy");
        var [getClaimData] = await db.db_connect.execute("select * from claim_list where id=?", [data.ClaimId]);
        console.log(getClaimData,"=======getClaimData");
        var sponserId=0;
        if (getClaimData && getClaimData[0] && getClaimData[0].sponser_id){
            sponserId = getClaimData[0].sponser_id;
        }
        else{
            return [{error:true,message:"Invalid Claim Request Id",code:410}];
        }
        
        
        // check used policies if 0 or 1 it will be free otherwise user will have to do payment
        
        var [[getUsedPolicies]] = await db.db_connect.execute("select count(*) as totalUsed from policy_otp_status where claim_id='" + data.ClaimId + "' and user_id='" +getClaimData[0].user_id+"'");

        // var [[totalIllnessForPolicy]] = await db.db_connect.execute("select count(*) as totalIllness from claim_list_illness where claim_request_id='" + data.ClaimId+"'");
        var [[totalIllnessForPolicy]] = await db.db_connect.execute("select ill_range from illness_range ");
       
        let totalUsedPolicies = getUsedPolicies.totalUsed;
        let totalIllnessHave = totalIllnessForPolicy.ill_range;
        let leftPolicies = parseInt(totalIllnessHave) - parseInt(totalUsedPolicies);
        if (leftPolicies > 1){
            var returnArr = [];
            returnArr.push({error:true, message: 'Unused policies left are more than 1. Kindly do pay top up', 'code': 410 });
            return returnArr;
        }
        var [getSponser] = await db.db_connect.execute("select * from sponser_login where id=? and is_deleted=?", [sponserId,0]);
        // console.log(getSponser,"==========getSponser");return false;
        if (getSponser && getSponser[0] && getSponser[0].type){
            var sponserType = getSponser[0].type;
        }
        else{
            // if old sponser not available/deleted
            var sponserType = 0;
        }
        
        var GivenIllneses=[]
        //New logic//
      
        if(data.illness_ids !=''){
           //   var GivenIllneses=  data.illness_ids.split(",").map(Number);  
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
        var final_Illness = '';
        var AllIlness = GivenIllneses.length;
        var totalIllness = (GivenIllneses.length - 1);
        var first = true;
        for (let i in GivenIllneses) {
            if (!first) {
                final_Illness += " , ";
            }
            else {
                first = false;
            }
            final_Illness += " '" + GivenIllneses[i] + "'";
        }
        var [checkFreeSponser] = await db.db_connect.execute("SELECT sponser_login_id FROM sponser_illness inner join sponser_login on sponser_login.id=sponser_illness.sponser_login_id inner join policies on  policies.sponsorID=sponser_illness.sponser_login_id  WHERE  sponser_illness.illness_id IN (" + final_Illness + ") and sponser_login.type='1' and sponser_login.is_deleted='0' and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1  GROUP BY sponser_login_id HAVING count(*) = " + AllIlness);
        
        console.log("SELECT sponser_login_id FROM sponser_illness inner join sponser_login on sponser_login.id=sponser_illness.sponser_login_id inner join policies on  policies.sponsorID=sponser_illness.sponser_login_id  WHERE  sponser_illness.illness_id IN (" + final_Illness + ") and sponser_login.type='1' and sponser_login.is_deleted='0' and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1   GROUP BY sponser_login_id HAVING count(*) = " + AllIlness);

       // console.log(checkFreeSponser,'==============checkFreeSponser');return
       
        
        
        var isFreeSponserExists=false;
        if (checkFreeSponser && checkFreeSponser.length > 0){
            isFreeSponserExists=true;
        }
    //    console.log("====checksponser",sponserType == '1' || sponserType == 0 || isFreeSponserExists==true);return false;
        let final_data='';
        if (sponserType == '1' || sponserType == 0 || isFreeSponserExists==true){ 
            
            var [getNextSponser] = await db.db_connect.execute("SELECT sponser_login_id FROM sponser_illness inner join sponser_login on sponser_login.id=sponser_illness.sponser_login_id inner join policies on  policies.sponsorID=sponser_illness.sponser_login_id  WHERE  sponser_illness.illness_id IN (" + final_Illness + ") and sponser_login.type='1'  and sponser_login.is_deleted='0' and sponser_login.id > '" + sponserId+"' and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1  GROUP BY sponser_login_id HAVING count(*) = " + AllIlness);
          
            console.log("SELECT sponser_login_id FROM sponser_illness inner join sponser_login on sponser_login.id=sponser_illness.sponser_login_id inner join policies on  policies.sponsorID=sponser_illness.sponser_login_id  WHERE  sponser_illness.illness_id IN (" + final_Illness + ") and sponser_login.type='1'  and sponser_login.is_deleted='0' and sponser_login.id > '" + sponserId+"' and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1   GROUP BY sponser_login_id HAVING count(*) = " + AllIlness);

             
        //    console.log("========getNextSponser",getNextSponser);return false;
            var nextSponser="";
            
            // check if next sponser exists
           
            if (getNextSponser && getNextSponser[0] && getNextSponser[0].sponser_login_id){
                nextSponser = getNextSponser[0].sponser_login_id;
            }
            else{
                // check any other free sponser exists
                var getAnyFreeSponser = checkFreeSponser;
                // console.log("=========getAnyFreeSponser",getAnyFreeSponser);return false;
                 if (getAnyFreeSponser && getAnyFreeSponser[0] && getAnyFreeSponser[0].sponser_login_id){
                    nextSponser = getAnyFreeSponser[0].sponser_login_id;
                    console.log("select * from user_used_free_sponsers where user_id='"+getClaimData[0].user_id+"' and sponser_id='"+nextSponser+"'");
                   
                    var [checkServiceNotTaken]=await db.db_connect.execute("select * from user_used_free_sponsers where user_id='"+getClaimData[0].user_id+"' and sponser_id='"+nextSponser+"'");
                    console.log(checkServiceNotTaken.length >0,"===========checkServiceNotTaken");
                    if(checkServiceNotTaken.length >0){
                        return [{error:true,message:"Sponser Already Used",code:410}];
                    }
                }
                else{
                    // if no free sponser exists
                    
                    var returnArr=[];
                    returnArr.push({error:true,message:'Free Sponser Not Available','code':200});
                    
                    return returnArr;
                }
                
                
            }
           
           
            
            ////Removing Old Entries//////////
            const [Users] = await db.db_connect.execute('SELECT users.username from users left JOIN claim_list ON claim_list.user_id=users.id where claim_list.id=?', [data.ClaimId]);
            let [oldClaimList] = await db.db_connect.execute('select * from claim_list where id=?', [data.ClaimId]);
            await db.db_connect.execute('delete from claim_list where id=?', [data.ClaimId]);
            await db.db_connect.execute('delete from claim_list_illness where claim_request_id=?',[data.ClaimId]);
            ////////////
           // var Illneses =  data.illness_id.split(",");
            var Illneses =  GivenIllneses
            if (Illneses.length == 0) return 0;
    
            ////Username/////////
            // Generating Policy number//
                var year= new Date().getFullYear()
                var user =Users[0].username
                var UsersCode= user.substring(0, 2);
                var name= UsersCode.toUpperCase();
                var code =  Math.floor(100000 + Math.random() * 9000);
                var policyNumber=(name+"/"+year+"/"+code);
                //Policy_code=Policy
                //console.log(policyNumber,'policyNumber');
            ///////////////////////////////

            //////////expiryDate//////////////////////
            var start = Math.floor(Date.now() / 1000)
            var nextYear=start+3.154e+7;
            /////////////////////////////////////////////

                    
            // Get Sponser Policy. It will be only one
            var [getPolicyData] = await db.db_connect.execute("select * from policies where sponsorID=" + nextSponser);
            var newPolicyId = 0;
            if (getPolicyData && getPolicyData[0] && getPolicyData[0].id) {
                newPolicyId = getPolicyData[0].id;
            }
            
            // if they will send hospital id then update the hospiotal id with that
            var claimListInserData = `(${nextSponser},${data.hospital_id},${oldClaimList[0].hospital_count},${newPolicyId},${oldClaimList[0].user_id},${0})`;
            
            // Insert Claim List Data
            var [getInsertedData]=await db.db_connect.execute("Insert into claim_list(sponser_id,hospital_id,hospital_count,policy_id,user_id,payment_status) VALUES" + claimListInserData);

           
            
            var newClaimId = getInsertedData.insertId;

                    let illnesesValues = "";
                    for (let i in Illneses) {
                        illnesesValues += `(${newClaimId},${Illneses[i]},'${policyNumber}',${nextYear}),`;
                    }
                    // console.log(illnesesValues);return false;
                    illnesesValues = illnesesValues.slice(0, -1);
            
            // Insert Claim List Illness
            let query = `INSERT INTO claim_list_illness (claim_request_id,illness_id,policy_number,expiry_date) VALUES${illnesesValues}`;
             
           //  var final_data=policyNumber;
            // console.log(query); return false;
            const [addIllneses] = await db.db_connect.execute(query); 
            const[DeleteOldUsedIllness]= await db.db_connect.execute('delete from policy_otp_status where claim_id=?',[data.ClaimId]);
            console.log("====================>",DeleteOldUsedIllness);
           
            const[sponserDetails]= await db.db_connect.execute('select claim_list.id,sponser_login.sponser_message,sponser_login.username,claim_list_illness.policy_number from sponser_login left JOIN claim_list on claim_list.sponser_id=sponser_login.id left JOIN claim_list_illness on claim_list.id= claim_list_illness.claim_request_id where sponser_login.id=? and claim_list_illness.claim_request_id=?  GROUP by claim_list.id',[nextSponser,newClaimId]);
            
            //Update left policy in Policy Table

            let countIllness= 1
            const[TotalIll]= await db.db_connect.execute('select policy_left from policies where sponsorID=?',[nextSponser]);
            
            var remaining=TotalIll[0].policy_left-countIllness;
           
            const[UpdateReamingPolicy]= await db.db_connect.execute('update policies set policy_left=? where sponsorID=?',[remaining,nextSponser]);


            await db.db_connect.execute("INSERT into user_used_free_sponsers(user_id,sponser_id) values('"+getClaimData[0].user_id+"','"+nextSponser+"')");
            //console.log(sponserDetails,"================return sponserDetails;");
        final_data= sponserDetails;
        }
        else{
            console.log("i am in else");
            var returnArr = [{ error: true, 'code': 200, message: 'Free Sponser Not Available' }];
            return returnArr;
        }
        

    console.log(final_data,"===========final_data");

   return final_data;
    }catch(err){
        throw err;
    }
}

async paid_topup(data) {
        try {
            console.log("in paid topup");
            //console.log(data,"==================data");return false;
            var [getClaimData] = await db.db_connect.execute("select * from claim_list where id=?", [data.ClaimId]);
            var sponserId = 0;
            if (getClaimData && getClaimData[0] && getClaimData[0].sponser_id) {
                sponserId = getClaimData[0].sponser_id;
            }
            var GivenIllneses=[]

            //var GivenIllneses = data.illness_id.split(",");
            if(data.illness_ids !=''){
                // Illneses =  data.illness_ids.split(",").map(Number);  
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
           // console.log(GivenIllneses,"=========GivenIllneses");return false;
            
            var final_Illness = '';
            var AllIlness = GivenIllneses.length;
            var totalIllness = (GivenIllneses.length - 1);
            var first = true;
            for (let i in GivenIllneses) {
                if (!first) {
                    final_Illness += " , ";
                }
                else {
                    first = false;
                }
                final_Illness += " '" + GivenIllneses[i] + "'";
            }
            
            //if error then keep after is_deleted

            //sponser_login.id > '" + sponserId+"'
            
            const [getNextSponser] = await db.db_connect.execute("SELECT sponser_login_id FROM sponser_illness inner join sponser_login on sponser_login.id=sponser_illness.sponser_login_id inner join policies on  policies.sponsorID=sponser_illness.sponser_login_id  WHERE  sponser_illness.illness_id IN (" + final_Illness + ") and sponser_login.type='2'  and sponser_login.is_deleted='0' and policies.expiry_date>= policies.expiry_date> date(now()) and policies.policy_left>=1 and sponser_login.status=1 GROUP BY sponser_login_id ");

            
            var nextSponser = "";

            // check if next sponser exists
            let final_data='';
            if (getNextSponser && getNextSponser[0] && getNextSponser[0].sponser_login_id) {
                nextSponser = getNextSponser[0].sponser_login_id;
            }
            else {
                // check any other paid sponser exists
                //HAVING count(*) = " + AllIlness
                var [getAnyFreeSponser] = await db.db_connect.execute("SELECT sponser_login_id FROM sponser_illness inner join sponser_login on sponser_login.id=sponser_illness.sponser_login_id inner join policies on  policies.sponsorID=sponser_illness.sponser_login_id   WHERE  sponser_illness.illness_id IN (" + final_Illness + ") and sponser_login.type='2' and sponser_login.is_deleted='0' and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1  GROUP BY sponser_login_id ");

                if (getAnyFreeSponser && getAnyFreeSponser[0] && getAnyFreeSponser[0].sponser_login_id) {
                    nextSponser = getAnyFreeSponser[0].sponser_login_id;    
                }
                else {
                    // if no paid sponser exists
                    var returnArr = [];
                    returnArr.push({error:true, message: 'No DUC ID Available At This Time.', 'code': 410 });
                    return returnArr;
                }
            }
          
            const [Users] = await db.db_connect.execute('SELECT users.username from users left JOIN claim_list ON claim_list.user_id=users.id where claim_list.id=?', [data.ClaimId]);
            let [oldClaimList] = await db.db_connect.execute('select * from claim_list where id=?', [data.ClaimId]);   
            ////////////
                //var Illneses = data.illness_id.split(",");
                var Illneses = GivenIllneses
                //console.log(Illneses.length == 0,"===================Illneses in paid");return false;
                if (Illneses.length == 0) return 0;

                ////Username/////////
                // Generating Policy number//
                var year = new Date().getFullYear()
                var user = Users[0].username
                var UsersCode = user.substring(0, 2);
                var name = UsersCode.toUpperCase();
                var code = Math.floor(100000 + Math.random() * 9000);
                var policyNumber = (name + "/" + year + "/" + code);
                //Policy_code=Policy
                //console.log(policyNumber,'policyNumber');
                ///////////////////////////////

                //////////expiryDate//////////////////////
                var start = Math.floor(Date.now() / 1000)
                var nextYear = start + 3.154e+7;
                /////////////////////////////////////////////


                // Get Sponser Policy. It will be only one
                var [getPolicyData] = await db.db_connect.execute("select * from policies where sponsorID=" + nextSponser);
                var newPolicyId = 0;
                if (getPolicyData && getPolicyData[0] && getPolicyData[0].id) {
                    newPolicyId = getPolicyData[0].id;
                }

                // if they will send hospital id then update the hospiotal id with that
            var claimListInserData = `(${nextSponser},${data.hospital_id},${oldClaimList[0].hospital_count},${newPolicyId},${oldClaimList[0].user_id},${1})`;

                // Insert Claim List Data
                var [getInsertedData] = await db.db_connect.execute("Insert into claim_list(sponser_id,hospital_id,hospital_count,policy_id,user_id,payment_status) VALUES" + claimListInserData);
                
                var newClaimId = getInsertedData.insertId;

                let illnesesValues = "";
                for (let i in Illneses) {
                    illnesesValues += `(${newClaimId},${Illneses[i]},'${policyNumber}',${nextYear}),`;
                }
                // console.log(illnesesValues);return false;
                illnesesValues = illnesesValues.slice(0, -1);
                
                // Insert Claim List Illness
                let query = `INSERT INTO claim_list_illness (claim_request_id,illness_id,policy_number,expiry_date) VALUES${illnesesValues}`;
                // console.log(query); return false;
                const [addIllneses] = await db.db_connect.execute(query);
              //  const [DeleteOldUsedIllness] = await db.db_connect.execute('delete from policy_otp_status where claim_id=?', [data.ClaimId]);
                /////////

         //Update left policy in Policy Table

                let countIllness= 1
                const[TotalIll]= await db.db_connect.execute('select policy_left from policies where sponsorID=?',[nextSponser]);
                
                var remaining=TotalIll[0].policy_left-countIllness;
            
                const[UpdateReamingPolicy]= await db.db_connect.execute('update policies set policy_left=? where sponsorID=?',[remaining,nextSponser]);
                
                 if(data.transaction_id==undefined){
                    data.transaction_id='';
                }
                // if(data.card_no==undefined){
                //     data.card_no ='';
                // }if(data.expiry_month_year==undefined){
                //     data.expiry_month_year='';
                // }if(data.ac_no==undefined){
                //     data.ac_no='';
                // } if(data.bank_name == undefined){
                //     data.bank_name='';
                // }
               
                    const[InsertValue]= await db.db_connect.execute('insert into transaction_history set user_id=?,claim_id=?,transaction_id=?,created=?,modified=?',[oldClaimList[0].user_id,data.ClaimId,data.transaction_id,start,start]);
     
              // return false;
          
                const[sponserDetails]= await db.db_connect.execute('select claim_list.id as claim_id,sponser_login.sponser_message,sponser_login.username,claim_list_illness.policy_number from sponser_login left JOIN claim_list on claim_list.sponser_id=sponser_login.id left JOIN claim_list_illness on claim_list.id= claim_list_illness.claim_request_id where sponser_login.id=? and claim_list_illness.claim_request_id=?  GROUP by claim_list.id',[nextSponser,newClaimId]);
                console.log(sponserDetails,"================return sponserDetails;");
            final_data= sponserDetails;

           
            console.log("==========",final_data);
            return final_data;
        } catch (err) {
            throw err;
        }
    }
async saving_payment(UserData,data){
    try{
    // console.log(UserData,data);return false;
    var TodayTime= Math.floor(Date.now() / 1000);
    let final_data='';
    const[InsertValue]= await db.db_connect.execute('insert into transaction_history set user_id=?,claim_id=?,transaction_id=?,amount=?,card_no=?,expiry_month_year=?,created=?,modified=?',[UserData,data.claim_id,data.transaction_id,data.amount,data.card_no,data.expiry_month_year,TodayTime,TodayTime]);
    if(InsertValue.affectedRows>0){
        final_data=InsertValue
    }
    return final_data;
    }catch(err){
        throw err;
    }
}

async cron_notification(){
    try{
       
        const[AllDetails]= await db.db_connect.execute('select cl.hospital_id as hospital_id, c.id as claim_ill_Id,c.*, u.id as user_id,u.username,u.device_token from claim_list_illness as c LEFT JOIN claim_list as cl ON c.claim_request_id=cl.id LEFT JOIN users as u ON cl.user_id=u.id WHERE c.push_status=0 AND c.otp_status=1 AND c.otp_gen_time!=""group by device_token');
       //console.log(AllDetails,"=============AllDetails");return false;
        for( let i=0;i<AllDetails.length;i++){
            console.log(AllDetails[i].hospital_id,"=====================hospital");
            // console.log(parseInt(AllDetails[i].otp_gen_time,'gh'))
            // console.log(AllDetails[i]); return false;
            // if (AllDetails[i]) {
           
            const[Hospital]= await db.db_connect.execute('SELECT  hospital_details.id,hospital_details.name from claim_list_illness LEFT JOIN claim_list ON claim_list.id=claim_list_illness.claim_request_id left JOIN hospital_details on claim_list.hospital_id=hospital_details.id where claim_list.hospital_id=?',[AllDetails[i].hospital_id]);
            console.log(Hospital,"===================Hospital");
           
                var GeneratedTIme=parseInt(AllDetails[i].otp_gen_time);
                //var pushTIme= GeneratedTIme + 7200;
                var pushTIme= GeneratedTIme + 60;
                //var pushTIme= 1558932088;
                var Now=Math.floor(Date.now() / 1000);
                console.log(pushTIme,'push')
                console.log(Now,'Now');
                console.log(Now>pushTIme,'pushTIme');
            // }
            // console.log(Now>pushTIme && AllDetails[i].device_token!='' && AllDetails[i].device_token!=0,'checkConditonfor Push');return false;
            if(Now>pushTIme && AllDetails[i].device_token!='' && AllDetails[i].device_token!=0){
                let notification = {
                    device_token: AllDetails[i].device_token,
                    message: "Please Give FeedBack",
                    notification_code:1234,
                    body: Hospital[0]
            }
            console.log('insert into saving_rating_push set user_id="'+AllDetails[i].user_id+'",is_read=0,hospital_id="'+AllDetails[i].hospital_id+'"');
            
            const[SavePush]= await db.db_connect.execute('insert into saving_rating_push set user_id="'+AllDetails[i].user_id+'",is_read=0,hospital_id="'+AllDetails[i].hospital_id+'"');
            console.log(SavePush,"=========SavePush");
            const[pushdetails]= await db.db_connect.execute('update claim_list_illness set push_status=? where claim_request_id=?',[1,AllDetails[i].claim_request_id]);
            console.log(pushdetails,"=========pushdetails");
            super.send_notification(notification);
            }
                

        } 
        console.log('ended');
    }catch(err){
        throw err;
    }
}
async payemnt_status(data){
    let final_data='';
    try{
       if(data!==0 && data!==''){
       const[details]= await db.db_connect.execute('select is_pay from claim_list_illness where claim_request_id=?',[data]);
       final_data=details[0].is_pay;
       }else{
        final_data=0
       }
       return final_data;
    }catch(err){
        throw err;
    }
}

async get_policy_status(data){
    try{
        var start = Math.floor(Date.now() / 1000);
       
       const[POlicyDetails]= await db.db_connect.execute('select claim_list_illness.expiry_date from claim_list_illness LEFT JOIN claim_list ON claim_list.id=claim_list_illness.claim_request_id where claim_list.user_id="'+data+'"  and claim_list_illness.expiry_date<"'+start+'" group by claim_list_illness.expiry_date');
       console.log(POlicyDetails!='','POlicyDetails!=""');
       let result='';
        if(POlicyDetails!=''){
            result =1;
        }else{
            result= 0;
        }
        return result;
    }catch(err){
        throw err;
    }
}
async get_policy_details(userId){
    try{
        const[Details]= await db.db_connect.execute('select hospital_details.name as hospital_name,claim_list_illness.policy_number from claim_list left JOIN claim_list_illness ON claim_list.id=claim_list_illness.claim_request_id left JOIN hospital_details ON hospital_details.id=claim_list.hospital_id where claim_list.user_id="'+userId+'"group by claim_list_illness.claim_request_id');
       
        return Details;
    }catch(err){
        throw err;
    }
}
async get_childPolicy(data){
    try{
        const[Details]= await db.db_connect.execute('select illnesses.name as illness_name,claim_list.user_id,hospital_details.name as hospital_name,hospital_details.id as hospital_id,claim_list_illness.policy_number from claim_list left JOIN claim_list_illness ON claim_list.id=claim_list_illness.claim_request_id left JOIN hospital_details ON hospital_details.id=claim_list.hospital_id left join illnesses on claim_list_illness.illness_id=illnesses.id where claim_list.user_id="'+data+'" group by claim_list_illness.claim_request_id');
        //console.log(Details[0],"==========================here in cliamlist");
        if(Details[0]){
        return Details[0];
    }
    else{
        return {
            illness_name:"",
            user_id: 0,
            hospital_name:"",
            policy_number:"",
        };
       
    }
    }catch(err){
        throw err;
    }
}
async get_sponser_paid(hospitalId){
    try{
       const[PaidHospital]= await db.db_connect.execute('SELECT count(sponser_login.id) as sponserId from sponser_login LEFT JOIN policies ON policies.sponsorID=sponser_login.id LEFT JOIN policy_hospital ON policies.id=policy_hospital.policy_id where sponser_login.type=2  and policies.expiry_date> date(now()) and policies.policy_left>=1 and policy_hospital.hospital_id=? ',[hospitalId]);

       let final_data=PaidHospital[0].sponserId;
     
       //  const[PaidHospital]= await db.db_connect.execute('SELECT count(sponser_login.id) as sponserId from sponser_login LEFT JOIN policies ON policies.sponsorID=sponser_login.id LEFT JOIN policy_hospital ON policies.id=policy_hospital.policy_id where sponser_login.type=2 and policies.expiry_date>= policies.expiry_date> date(now()) and policies.policy_left>=1 and policy_hospital.hospital_id=?',[hospitalId]);

       // let final_data=PaidHospital[0].sponserId;

       return final_data;
    }catch(err){
        throw err;
    }
}
async get_Particular_review(hospitalId){
    try{
        const[Details]= await db.db_connect.execute('select review.*,users.username,users.image from review  LEFT JOIN users ON review.user_id=users.id WHERE review.hospital_id=?',[hospitalId]);
    
    return Details
    }catch(err){
        throw err;
    }
}
async get_avg_review(hospitalId){
    try{
     const[GetAvgRating]= await db.db_connect.execute('SELECT round(AVG(rating),1) as avgRating FROM review where review.hospital_id=?',[hospitalId]);
     let Final_data=GetAvgRating[0].avgRating
     console.log(Final_data);
     return Final_data;
    }catch(err){
        throw err;
    }
}
async check_policy_exist(userId){
    try{
        const[GetDetails]= await db.db_connect.execute('select count(id) as count from claim_list where user_id="'+userId+'"');
      
        let status='';
        if(GetDetails){
            status=1
        }else{
            status=0
        }
        return status;
    }catch(err){
        throw err;
    }
}
async getAllPolicy(userId){
    try{
    //let emparr=[];
    
    //   const[getAllpolicy]= await db.db_connect.execute('SELECT *,ifnull((select count(*) from policy_otp_status where claim_id=claim_list.id),0) as counts FROM `claim_list` where user_id=? GROUP by claim_list.id',[userId]);
         const[getAllpolicy]=await db.db_connect.execute('SELECT *,ifnull((select count(*) from policy_otp_status where claim_id=claim_list.id),0) as counts FROM `claim_list` LEFT JOIN claim_list_illness ON claim_list.id=claim_list_illness.claim_request_id where user_id=? and claim_list_illness.expiry_date>=UNIX_TIMESTAMP() GROUP by claim_list.id',[userId]);
       // console.log(getAllpolicy,"======getAllPolicy");return;
       if(getAllpolicy.length>0){
        return  getAllpolicy
       }else{
           return '';
       }
       
    }catch(err){
        throw err;
    }
}

async search_hospital(data){
    try{
        console.log(data,"=================search_hospital");
        const[Hospital]= await db.db_connect.execute("select * from hospital_details where is_deleted=0 and name LIKE '"+data+"%' or address LIKE '"+data+"%' or city LIKE '"+data+"%' or state LIKE '"+data+"%' or country LIKE '"+data+"%' order by hospital_details.id asc");
    return Hospital;
    }catch(err){
        throw err;
    }
}
}