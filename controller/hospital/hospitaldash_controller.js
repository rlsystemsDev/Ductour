
const Hospitaldash = require('../../model/hospital/hospitaldash_model');
const Contents = require('../../model/contents_model');
var Database = require('../../config/database.js');
var moment = require('moment');
const btoa = require('btoa');
var mythis = '';
var hospitaldash = '';
var contents='';
var db = '';
module.exports = class Hospitaldash_controller {

    constructor() {
        hospitaldash = new Hospitaldash();
        contents = new Contents();
        mythis = this;
        db = new Database();
    }

    hospitallogin(req, res) {

        if (req.session.auth == true) {
            res.redirect('Hospitaldash/dashboard');
        } else {
            res.render('hospital_admin/Hospitaldash/loginpage', { msg: req.flash('msg1') });
        }

    }
    login(req, res) {    //for sponsers login check
        
        hospitaldash.check_login(req.body.email, req.body.password, function (response) {
           
            if (response != '') {
               
                var sess = req.session;  //initialize session variable
                req.session.email = response[0].email; //set email as session_id
                req.session.name = response[0].name;
                req.session.h_id = response[0].id;
                req.session.auth = true;
                req.session.image = response[0].image;
                req.session.category_id=response[0].category_id;
                console.log("successfully Login");
                res.redirect('/Hospitaldash/dashboard');
            } else {
                req.flash('msg1', 'Invalid Login ');
                res.redirect('/hospitaldash');
            }
        });

    }
    async dashboard(req, res) {   //for Hospital Dashboard page
        if (req.session.auth == true) {
            //console.log(req.session.h_id,'sess');return false;
            let dashboard = await hospitaldash.get_dashboard_data(req.session.h_id);
            let total_policies = await hospitaldash.gettotalpolicies(req.session);
            let policyTaken = await hospitaldash.policyTaken(req.session);

            //Get Hospital Ratings

            let getAvgRating= await db.db_connect.execute('select IFNULL(avg(rating),0) as AvgRating from review where hospital_id=?',[req.session.h_id]);
            
            let getHighestRating= await db.db_connect.execute('select IFNULL(Max(rating),0) as HighestRating from review where hospital_id=?',[req.session.h_id]);

            let getLowestRating= await db.db_connect.execute('select IFNULL(MIN(rating),0) as LowestRating from review where hospital_id=?',[req.session.h_id]);

            let ratingdata={
                AvgRating:parseFloat(getAvgRating[0][0].AvgRating).toFixed(2),
                HighestRating:parseFloat(getHighestRating[0][0].HighestRating).toFixed(2),
                LowestRating:parseFloat(getLowestRating[0][0].LowestRating).toFixed(2)
            }
            


            res.render('hospital_admin/Hospitaldash/dashboard', { response: dashboard,ratingdata:ratingdata, msg: req.flash('msg1'), session: req.session, total_policies: total_policies, policyTaken: policyTaken ,title:'Dashboard'})
        } else {
            req.flash('msg1', 'Please login first ');
            res.redirect('/hospitaldash');
        }
    }
    logout(req, res) {
        req.session.auth = '';
        req.session.email = ''; //set user id
        req.session.h_id = '';
        req.session.image = '';
        req.flash('msg1', 'Logout successfully Done');
        res.redirect('/hospitaldash');
    }

    calculateAge(y, m, d) {
        var _birth = parseInt("" + y + mythis.affixZero(m) + mythis.affixZero(d));
        var today = new Date();
        var _today = parseInt("" + today.getFullYear() + mythis.affixZero(today.getMonth() + 1) + mythis.affixZero(today.getDate()));
        return parseInt((_today - _birth) / 10000);
    }

    affixZero(int) {
        if (int < 10) int = "0" + int;
        return "" + int;
    }
 
    get_illness_list(req, res) {
        //console.log(req.body); return false;
        if (req.session.auth == true) {
            let is_deleted = 0;
            hospitaldash.illness_list(is_deleted, function (response) {
                //console.log("response");  return false;
                res.render('hospital_admin/hospital_userlist/illnesss_list', { title: 'Illneses', response: response, msg: req.flash('msg1'), session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/hospitaldash');
        }
    }
    create(req, res) {

        if (req.session.auth == true) {
            res.render('hospital_admin/hospital_userlist/hospital_create', { title: 'Create Hospital ', response: '', msg: req.flash('msg1'), session: req.session });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/hospitaldash');
        }
    }
    save(req, res) {
           
        if (req.session.auth == true) {

            let files = '';

            if (req.files && req.files.file && req.files.file != '') {
                files = req.files;
            }
            // console.log(req.body);
            // console.log(files);return false;
            if (req.body.user_id != '') {
                hospitaldash.update_hospital_details(req.body, files, function (response) {

                    if (response == 0) {
                        req.flash('msg1', 'Email already taken use another email!');
                        res.redirect('/hospitaldash/illness_add');
                    } else {
                        req.flash('msg1', 'User updated successfully!');
                        req.session.save(function () {
                            res.redirect('/hospitaldash/get_userlist');
                        });

                    }
                });
            } else {

                hospitaldash.save_hospital(req.body, files, function (response) {

                    if (response == 0) {
                        req.flash('msg1', 'Email already taken use another email!');
                        res.redirect('/hospitaldash/illness_add');
                    } else {
                        req.flash('msg1', 'User created successfully!');
                        req.session.save(function () {
                            res.redirect('/hospitaldash/get_userlist');
                        });

                    }

                });
            }
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/hospitaldash');
        }
    }
    edit(req, res) {
        if (req.session.auth == true) {
           
            hospitaldash.edit_hospital(req.query.id, function (response) {
               
                res.render('hospital_admin/hospital_userlist/hospital_create', { title: 'Edit Users', response: response[0], msg: '', session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/hospitaldash');
        }

    }
    view(req, res) {
        if (req.session.auth == true) {
            
            hospitaldash.illness_lists(req.query.id, function (response) {
                res.render('hospital_admin/hospital_userlist/illnesss_view', { title: 'Edit Users', response: response[0], msg: '', session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/hospitaldash');
        }

    }
    child_view(req,res){
        try{
            if (req.session.auth == true) {
                hospitaldash.child_view(req.query.id, function (response) {
                    return res.json(response);
                
                /* if(response!=''){
                    // res.render('users/child_data', { title: 'child details', response:response[0], msg: '',session: req.session });
                   // res.json('1');
                }else{
                    return res.send(response);
                } */
                });
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/hospitaldash');
            }
        }catch(e){
            throw e;
        }
    }

    user_view(req, res) {
        //console.log("view"); return false;
        if (req.session.auth == true) {
            hospitaldash.edit_hospital(req.query.id, function (response) {
                res.render('hospital_admin/hospital_userlist/user_view', { title: 'View Users', response: response[0], msg: '', session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/hospitaldash');
        }

    }
    get_profile_page(req, res) {
        //console.log("view"); return false;
        if (req.session.auth == true) {
            hospitaldash.get_profile(req.session.h_id, function (response) {
                res.render('hospital_admin/hospital_userlist/profile_page', { title: 'View Profile', response: response[0], msg: '', session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/hospitaldash');
        }

    }

    get_password_page(req, res) {
        //console.log("view"); return false;
        if (req.session.auth == true) {
            hospitaldash.get_password_page(req.session, function (response) {
                res.render('hospital_admin/hospital_userlist/change_password', { title: 'View Profile', response: response[0], msg: '', session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/hospitaldash');
        }

    }

    update_hospital_profiles(req, res) {

        if (req.session.auth == true) {

            let files = '';

            if (req.files && req.files.file && req.files.file != '') {
                files = req.files;
            }
            // console.log(req.body);
            // console.log(files);return false;
            hospitaldash.update_hospital_profile(req.body, req.session.h_id, files, function (response) {
                if (response[0].image != '') {
                    req.session.image = response[0].image;
                }
                req.flash('msg1', 'Profile updated successfully');
                res.redirect('/hospitaldash/get_profile');
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/hospitaldash');
        }
    }

    async check_password(req, res) {
        try {
            let data = await hospitaldash.check_password(req.body);
            if (data != '') {
                res.json('1');
            } else {
                res.json('0');
            }
        } catch (err) {
            throw err;
        }
    }




    save_password(req, res) {
        //console.log(req.body); return false;
        if (req.session.auth == true) {

            hospitaldash.save_passwordd(req.body, req.session.h_id, function (response) {
                req.flash('msg1', 'Password updated successfully');
                res.redirect('/hospitaldash/dashboard');
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/hospitaldash');
        }

    }

    async policyList(req, res) {
        try {
            
            if (req.session.auth == true) {
                let policyList = await hospitaldash.policyList(req.session);
                res.render('hospital_admin/hospital_userlist/policy', { response: policyList, session: req.session, title: '', msg: '' })
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/hospitaldash');
            }
        } catch (err) {
            throw err;
        }
    }

    async claimnow(req, res) {
        try {
            if (req.session.auth == true) {
               
                let checkOtp = await hospitaldash.checkOtp(req.body);
                if (checkOtp == '2') return res.json("2");
                if (checkOtp == '3') return res.json("3");
                if (checkOtp == '4') return res.json("4");
                if (checkOtp != '') return res.json("1");
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/hospitaldash');
            }
        } catch (err) {
            throw err;
        }
    }
    async add_claim(req,res){
        if(req.session.auth == true){
           try{
                let claim= await hospitaldash.get_all_claim(req.session.h_id);
                res.render('hospital_admin/hospital_userlist/claim_list_new', { response: claim, session: req.session, title: '', msg: '' })
            }catch(err){
                throw err;
            }
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/hospitaldash');
        }
}
    async varify_amount(req,res){
        try{
        // console.log(req.files,'ghre');return false;
            let files = '';
                if(req.files.file && req.files.file!=''){
                    files = req.files;
                }

         let Result= await hospitaldash.amount_sent(req.body,files);
         if (Result != '') {
            res.json('1');
        } else {
            res.json('0');
        }
        }catch(err){
            throw err;
        }
    }
    async get_hosp_userlist(req,res){
        if(req.session.auth == true){
           try{

                //console.log(req.session.category_id,"===========sss");
                let claim= await hospitaldash.get_hosp_users(req.session.h_id);
                let getillness= await  db.db_connect.execute('select * from illnesses where status=?',[1]);
               // console.log(getillness[0],"============ddd");return;
                res.render('hospital_admin/hospital_userlist/hospital_userlist', { response: claim, getillness:getillness[0],session: req.session, title: 'get_hosp_userlist', msg: '' })
            }catch(err){
                throw err;
            }
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/hospitaldash');
        }
}
async viewPolicy(req,res){
    if(req.session.auth == true){
       try{
            res.render('hospital_admin/hospital_userlist/viewpolicy', { response: '', session: req.session, title: 'viewpolicy', msg: '' })
        }catch(err){
            throw err;
        }
    }else{
        req.flash('msg1', 'Please Login first');
        res.redirect('/hospitaldash');
    }
}
async viewdoc(req,res){
    if(req.session.auth == true){
        try{
            let PolicyNumber=req.body.docid;
            let CheckDocid= await hospitaldash.CheckPolicyNumber(PolicyNumber);
            if(CheckDocid.length>0){
                let ramaining= await hospitaldash.getRemining(CheckDocid[0].claimId);
                ramaining[0].total=4;
               
                res.render('hospital_admin/hospital_userlist/policyview', { response: CheckDocid,ramaining:ramaining, session: req.session, title: '', msg:req.flash('msg1')});
            }else{
                console.log("Invalid Doc Id");
                //req.flash('msg1','Invalid Doc Id');
                //res.redirect('/hospitaldash');
                res.render('hospital_admin/hospital_userlist/policy2', { response: '', session: req.session, title: 'viewpolicy', msg:req.flash('msg1')});
            }
        }catch(err){
            throw err;
        }
    }else{

    }
}
    async viewAll(req,res){
    if(req.session.auth == true){
        try{
            // let AllPolicyDetails= await hospitaldash.getAllPolicyDetails(req.query.claimId);
            // let getillness= await  db.db_connect.execute('select * from illnesses where status=?',[1]);

            // for(let i in AllPolicyDetails){
            //     let start_date = Math.round(    new Date(AllPolicyDetails[i].created_at).getTime() / 1000);
            //     AllPolicyDetails[i].created_at = moment.unix(start_date).format("MM/DD/YYYY");
                
            //     if(AllPolicyDetails[i].illnessId!==null){
            //          var getitems= await hospitaldash.getmyitem(AllPolicyDetails[i].illnessId);
            //         // console.log(getitems,"==========getitems");
            //          AllPolicyDetails[i].multipleItems = getitems;
            //     }
            // }
        
            // let getclaimedillnees= await db.db_connect.execute('select  users.username,illnesses.name, users_policy_history.*  from users_policy_history  left JOIN users on users.id= users_policy_history.user_id LEFT JOIN illnesses on illnesses.id=users_policy_history.illness_id where claim_id=?',[req.query.claimId]);

            let getclaimedillnees= await db.db_connect.execute('select  claim_list_illness.policy_number,users.username,users.phone_code,users.phone_number,illnesses.name, users_policy_history.*  from users_policy_history  left JOIN users on users.id= users_policy_history.user_id LEFT JOIN illnesses on illnesses.id=users_policy_history.illness_id LEFT JOIN claim_list_illness on claim_list_illness.claim_request_id=users_policy_history.claim_id  where claim_id=? group by illnesses.id ',[req.query.claimId]);

            for(let i in getclaimedillnees[0]){
                let newAeeay = [];

                let getitems= await db.db_connect.execute('select name from item where id IN ('+getclaimedillnees[0][i].item_ids+')');
                // console.log(getitems[0],"=========ssss")


                getclaimedillnees[0][i].Items = getitems[0];
            }           

            res.render('hospital_admin/hospital_userlist/claim_list_new', { response:getclaimedillnees[0],session: req.session, title: 'get_hosp_userlist', msg: '' })
        }catch(err){
            throw err;
        }
    }else{
        req.flash('msg1', 'Please Login first');
        res.redirect('/hospitaldash');
    }
    
}
 async Hospitalfaq(req, res) {
    //console.log(req.body); return false;
    if (req.session.auth == true) {
        let getDetails= await contents.findAllFaqsHospital();
        console.log(getDetails,"==========>>");
        res.render('hospital_admin/hospital_userlist/faqs', { title: 'hosp_faq', response: getDetails, msg: req.flash('msg1'), session: req.session });
        // let is_deleted = 0;
        // hospitaldash.illness_list(is_deleted, function (response) {
        //     //console.log("response");  return false;
        //     res.render('hospital_admin/faqs', { title: 'Illneses', response: response, msg: req.flash('msg1'), session: req.session });
        // });
    } else {
        req.flash('msg1', 'Please Login first');
        res.redirect('/hospitaldash');
    }
}
async get_illness_items(req,res){
    try{
    if(req.session.auth==true){
        

        let getillnessDetails = await db.db_connect.execute('select items from illnesses where id=?',[req.body.illnessId]);
        
        console.log(getillnessDetails[0][0].items,"==============getillnessDetails[0][0].items");

        let IllnessItems=getillnessDetails[0][0].items;
        IllnessItems = JSON.parse(IllnessItems);
        IllnessItems = IllnessItems.join(",");
        //IllnessItems = '('+IllnessItems+')';

        // console.log(IllnessItems)
        // return
        console.log('select  * from item where id IN('+IllnessItems+')  and category_id="'+req.session.category_id+'"');

        let finditems= await db.db_connect.execute('select  * from item where id IN('+IllnessItems+')  and category_id="'+req.session.category_id+'"');
        res.send(finditems[0]); 

    }else{
        req.flash('msg1', 'Please Login first');
        res.redirect('/hospitaldash');
    }
    }catch(err){
        throw err;
    }
}
}