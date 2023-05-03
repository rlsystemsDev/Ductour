const Insurance = require('../model/insurance_model');
//const atob = require('atob');
var Database = require('../config/database.js');
const btoa = require('btoa');
var moment = require('moment');
var insurance='';
var db = '';

//Flutter Wave Payment//

const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave("FLWPUBK_TEST-900fb64862493a97cb03e859ce563c31-X", "FLWSECK_TEST-802f06dd8b44d91fc3dc1112c194fe79-X");


module.exports = class insurance_controller {
    
    constructor () {
       insurance = new Insurance();   
       db = new Database(); 
    }

    insurance_list(req,res){
		if(req.session.authenticated == true){
            let is_deleted=0;
            insurance.get_insurance_list(is_deleted,function(response){
               // console.log(response);  return false
                res.render('Insurance/view_list',{title:'Sponsor Hospitals',response:response,msg:req.flash('msg1'),session:req.session});
            });
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    insurance_view (req, res) {
        
        if(req.session.authenticated == true){
            insurance.view_insurance_detail(req.query.id,function(response){
                //console.log('sdfsd');
                //console.log(response);return false;
                res.render('Insurance/view',{title:'view  Users',response:response[0],msg:'',session:req.session});
                 
            });
         }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
        // console.log("safd"); return false;
    }
    claim_list(req,res){
		if(req.session.authenticated == true){
			
            let is_deleted=0;
            insurance.get_claim_list(is_deleted,function(response){
                for(let i in response){
                    let start_date = Math.round(new Date(response[i].created_at).getTime() / 1000);
                    response[i].created_at= moment.unix(start_date).format("YYYY-MM-DD HH:mm");
                    response[i].expiry_date = moment.unix(response[i].expiry_date).format("YYYY-MM-DD HH:mm");
                }
                res.render('Insurance/claim_list',{title:'Sponsor Hospitals',response:response,msg:req.flash('msg1'),session:req.session});
            });
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    ducmel_claim_list(req,res){
		if(req.session.authenticated == true){
			
            let is_deleted=0;
            insurance.get_claim_list(is_deleted,function(response){
                for(let i in response){
                    let start_date = Math.round(new Date(response[i].created_at).getTime() / 1000);
                    response[i].created_at= moment.unix(start_date).format("YYYY-MM-DD HH:mm");
                    response[i].expiry_date = moment.unix(response[i].expiry_date).format("YYYY-MM-DD HH:mm");
                }
                res.render('Insurance/claim_list_ducmeal',{title:'ducmeal',response:response,msg:req.flash('msg1'),session:req.session});
            });
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
   claim_view (req, res) {
        
        if(req.session.authenticated == true){
            insurance.view_claim_detail(req.query.id,function(response){
                
               /* for(let i in response){
                        var year = new Date(response[i].Date*1000).getFullYear();
                        var month =new Date(response[i].Date*1000).getMonth();
                        var date =new Date(response[i].Date*1000).getDate();
                        response[i].Date = year+'-'+month+'-'+date;
                         
                } */
                res.render('Insurance/claim_view',{title:'view  Users',response:response[0],msg:'',session:req.session});
                 
            });
         }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
        
    }
    claim_view_ducmeal (req, res) {
        
        if(req.session.authenticated == true){
            insurance.view_claim_detail(req.query.id,function(response){
                console.log(response[0])
                res.render('Insurance/claim_view _ducmeal',{title:'view  Users',response:response[0],msg:'',session:req.session});
                 
            });
         }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
        
    }
     async hospital_claimed(req,res){
		if(req.session.authenticated == true){
            // let getclaimedillnees= await db.db_connect.execute('select  users.username,users.phone_code,users.phone_number,illnesses.name, users_policy_history.*  from users_policy_history  left JOIN users on users.id= users_policy_history.user_id LEFT JOIN illnesses on illnesses.id=users_policy_history.illness_id');

            let getclaimedillnees = await db.db_connect.execute('select hospital_details.name as hospital_name,claim_list_illness.policy_number,users.username,users.phone_code,users.phone_number,illnesses.name, users_policy_history.*  from users_policy_history  left JOIN users on users.id= users_policy_history.user_id LEFT JOIN illnesses on illnesses.id=users_policy_history.illness_id LEFT JOIN claim_list_illness on claim_list_illness.claim_request_id=users_policy_history.claim_id left JOIN claim_list on claim_list.id=claim_list_illness.claim_request_id LEFT JOIN hospital_details on hospital_details.id=claim_list.hospital_id group by id');
            for(let i in getclaimedillnees[0]){
                if(getclaimedillnees[0][i].item_ids){
                    let getitems= await db.db_connect.execute('select name from item where id IN ('+getclaimedillnees[0][i].item_ids+')');
                 console.log(getitems[0],"=========ssss");
                getclaimedillnees[0][i].Items = getitems[0];
                }
                
                
            }  
        
            res.render('Insurance/claim_list_hospital',{title:'hospitalclaim',response:getclaimedillnees[0],msg:'',session:req.session});
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }

    async pay_hospital(req,res){
        try {
            const payload = {
                "account_bank": "044", //This is the recipient bank code. Get list here :https://developer.flutterwave.com/v3.0/reference#get-all-banks
                "account_number": "0690000040",
                "amount": 100,
                "narration": "ionnodo",
                "currency": "NGN",
                "reference": "transfer-"+Date.now()+"_PMCK", //This is a merchant's unique reference for the transfer, it can be used to query for the status of the transfer
                "callback_url": "https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d",
                "debit_currency": "NGN"
            }
     
            const response = await flw.
     
    Transfer.initiate(payload)
            console.log(response,"=================in first api");
             const payload1 = {
                    "id":response.data.id // This is the numeric ID of the transfer you want to fetch. It is returned in the call to create a transfer as data.id
                }
            const GetTransferStatus = await flw.Transfer.get_a_transfer(payload1);
            console.log(GetTransferStatus,"------------GetTransferStatus");

            var request = require('request');
                    var options = {
                    'method': 'GET',
                    'url': 'https://api.flutterwave.com/v3/transfers/'+response.data.id +'/retries',
                    'headers': {
                        'Authorization': 'Bearer FLWSECK_TEST-802f06dd8b44d91fc3dc1112c194fe79-X'
                    }
                    };
                    request(options, function (error, response) { 
                    if (error) throw new Error(error,"---------error in get ");
                    console.log(response.body,"===========body");
                    });

        } catch (error) {
            console.log(error)
        }
     
    }
    }