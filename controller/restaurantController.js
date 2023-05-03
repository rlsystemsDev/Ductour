//const Illneses = require('../model/illneses_model');
const Hospitaldash = require('../model/hospital/hospitaldash_model');
const Helper = require('../config/helper');
//const atob = require('atob');
const btoa = require('btoa');
var Database = require('../config/database.js');
var path = require('path');
var moment = require('moment');
var helpers = '';
//var illneses = '';
var hospitaldash = '';
var db = '';

module.exports = class illneses_controller {

    constructor() {
        //super();
        helpers = new Helper;
       // illneses = new Illneses();
       hospitaldash = new Hospitaldash();
       
        db = new Database();
    }
     async restrologin(req, res) {
        try{
             if(req.session.setauth==true){
                res.redirect('/restaurant/dashboard');
             }else{
                res.render('restaurantPanel/login', { title: 'resturant', response:'' ,msg: req.flash('msg1'), session: req.session });
             }
           
        }catch(err){
            throw err;
        }
    }
     async login(req, res) { 
         var time = Date.now(); 
         var digits = '0123456789'; 
         var password = ''; 
         for (let i = 0; i < 4; i++ ) { 
             password += digits[Math.floor(Math.random() * 10)]; 
         } 
         var hash= helpers.crypt(req.body.password);
             let response= await db.db_connect.execute('select * from ducmeal where email=? and password=?',[req.body.email,hash]);
         
            //console.log(response);return;
             if (response[0].length>0) {
                var sess = req.session;  //initialize session variable
                req.session.userId = response[0][0].id; //set user id
                req.session.user = response[0][0].email;
                req.session.photo = response[0][0].image;
                req.session.password = response[0][0].password;
                req.session.setauth = true;
               // console.log(req.session,"================>>req.session");
                res.redirect('/restaurant/dashboard');
            } else {
                req.flash('msg1', 'Invalid Login Credentails');
                res.redirect('/restaurants');
            }
    }
     async dashboard(req, res) {

        if (req.session.setauth == true) {  

                let getusercount=  await hospitaldash.get_hosp_users_meal(req.session.userId);
                console.log(getusercount.length,"===========sss");
                res.render('restaurantPanel/index', { title: 'Dashboard', response:getusercount.length, session: req.session });
            
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/restaurants');
        }
    }
    logout(req, res) {   //for admin logout
        req.session.userId = ''; //set user id
        req.session.user = '';
        req.session.photo = '';
        req.session.password = '';
        req.session.setauth = false;

        req.flash('msg1', 'Logout Success');
        res.redirect('/restaurants');
    }
    async get_hosp_userlists(req,res){
        if(req.session.setauth == true){
           try{
              // console.log(req.session);return;
                //let claim= await hospitaldash.get_hosp_users(req.session.h_id);
                let claim= await hospitaldash.get_hosp_users_meal(req.session.userId);
                console.log(claim,"==========claim");
                res.render('restaurantPanel/hospital_userlist', { response: claim, session: req.session, title: '', msg: '' })
            }catch(err){
                throw err;
            }
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/restaurants');
        }
}
async viewAll(req,res){
    if(req.session.setauth == true){
        try{
            let AllPolicyDetails= await hospitaldash.getAllPolicyDetails(req.query.claimId);
            for(let i in AllPolicyDetails){
                let start_date = Math.round(    new Date(AllPolicyDetails[i].created_at).getTime() / 1000);
                AllPolicyDetails[i].created_at = moment.unix(start_date).format("MM/DD/YYYY");
            
                if(AllPolicyDetails[i].illnessId!==null){
                     var getitems= await hospitaldash.getmyitem(AllPolicyDetails[i].illnessId);
                    // console.log(getitems,"==========getitems");
                     AllPolicyDetails[i].multipleItems = getitems;
                }
            }
            console.log(AllPolicyDetails,"=========AllPolicyDetails");
            res.render('restaurantPanel/claim_list_new', { response: AllPolicyDetails, session: req.session, title: '', msg: '' })
        }catch(err){
            throw err;
        }
    }else{
        req.flash('msg1', 'Please Login first');
        res.redirect('/restaurants');
    }
}
view(req, res) {
    if (req.session.setauth == true) {
        hospitaldash.illness_lists(req.query.id, function (response) {
            res.render('restaurantPanel/illnesss_view', { title: 'Edit Users', response: response[0], msg: '', session: req.session });
        });
    } else {
        req.flash('msg1', 'Please Login first');
        res.redirect('/restaurants');
    }
}
async claimnow(req, res) {
    try {
        
        if (req.session.setauth == true) {
          // console.log(req.body,"========body");return;
            let checkOtp = await hospitaldash.checkOtp(req.body);
            if (checkOtp == '2') return res.json("2");
            if (checkOtp == '3') return res.json("3");
            if (checkOtp == '4') return res.json("4");
            if (checkOtp != '') return res.json("1");
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/restaurants');
        }
    } catch (err) {
        throw err;
    }
}
async Mealclaimnow(req,res){
    if(req.session.setauth==true){
        //console.log(req.body.claim);return;

        let verifyotp= await db.db_connect.execute('select * from ducmeal_code where claim_id=? and rest_id=?',[req.body.claim_id,req.session.userId]);
        console.log('select * from ducmeal_code where claim_id=? and rest_id=?',[req.body.claim_id,req.session.userId]);
        console.log(verifyotp[0].length>0,"===========check")
        if(verifyotp[0].length>0){
        console.log(verifyotp[0][0].is_verified==1,"=======check");
        if(verifyotp[0][0].is_verified==0){
            if(req.body.claim==verifyotp[0][0].code){
                let updatevalue= await db.db_connect.execute('update ducmeal_code set is_verified=?,text=? where claim_id=? and rest_id=?',[1,req.body.text,req.body.claim_id,req.session.userId]);

                return res.json("3");
            }else{
                return res.json("4");
            }
        }else{
            return res.json("5");
        }
        }else{
            return res.json("1");
        }
        
    }else{
        req.flash('msg1', 'Please Login first');
        res.redirect('/restaurants');
    }
}
}
