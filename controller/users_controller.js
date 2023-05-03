const Users = require('../model/users_model');
const Hospitaldash = require('../model/hospital/hospitaldash_model');
//const atob = require('atob');
const btoa = require('btoa');

var mythis = '';    
var users='';
var hospitaldash='';
module.exports = class Users_controller {
    
    constructor () {
        users = new Users();
        hospitaldash = new Hospitaldash();
        mythis=this;    
    }

    calculateAge (y, m, d) {
        var _birth = parseInt("" + y + mythis.affixZero(m) + mythis.affixZero(d));
        var  today = new Date();
        var _today = parseInt("" + today.getFullYear() + mythis.affixZero(today.getMonth() + 1) + mythis.affixZero(today.getDate()));
        return parseInt((_today - _birth) / 10000);
    }

    affixZero (int) {
        if (int < 10) int = "0" + int;
        return "" + int;
    }

    get_users (req, res) {
        if(req.session.authenticated == true){
            var is_deleted = 0;
         
            users.get_all_users(is_deleted,function(results){
                
                for(var i in results){
                    let date = new Date(results[i].dob).getDate();   
                    let month = new Date(results[i].dob).getMonth()+1;   
                    let year = new Date(results[i].dob).getFullYear(); 
                    var age = mythis.calculateAge(year, month, date);
                    
                    
                    results[i].age = age;
                    results[i].ids = btoa(results[i].id);
                    results[i].gender = results[i].gender==1 ? 'Female':'Male';
                    

                    
                    
               }

               
               res.render('users/index',{title:'Users',response:results,msg:req.flash("msg1"),session:req.session});
                
            });
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }

    create (req, res) {
       
        if(req.session.authenticated == true){
                res.render('users/user_create',{title:'Create Users',response:'',msg:req.flash('msg1'),session:req.session});
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }

    save (req, res) {
       
        if(req.session.authenticated == true){
                let files = '';
                if(req.files.file && req.files.file!=''){
                    files = req.files;
                }
           
              
            if(req.body.user_id != ''){
                
                users.update_user_details(req.body,files,function(response){
                    
                    if(response == 0){
                        req.flash('msg1', 'Email already taken use another email!');
                        res.redirect('/users/create');
                    }else{
                        req.flash('msg1', 'User updated successfully!');
                        req.session.save(function () {
                            res.redirect('/users');
                        });
                        
                    }    
                });
            }else{
                
                users.save_users(req.body,files,function(response){
                    
                    if(response == 0){
                        req.flash('msg1', 'Email already taken use another email!');
                        res.redirect('/users/create');
                    }else{
                        req.flash('msg1', 'User created successfully!');
                        req.session.save(function () {
                            res.redirect('/users');
                        });
                        
                    }
                    
                });
            }
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }

    edit (req, res) {
        if(req.session.authenticated == true){
            users.get_user_detail(req.query.id,function(response){
                res.render('users/user_create',{title:'Edit Users',response:response[0],msg:'',session:req.session});
            });
         }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }   
    }
    views (req, res) {
        if(req.session.authenticated == true){
            users.view_user_detail(req.query.id,function(response){
                 //console.log( response.users[0].gender,"=======in controller");
                response.users[0].gender = response.users[0].gender==1 ? 'Female':'Male';
                res.render('users/user_view',{title:'view  Users',response:response,msg:'',session:req.session});
            });
         }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
        
    }

    delete_data (req, res) {
       
        let table = req.body.table;
        let id = req.body.id;
        users.delete_data(table, id, function(response){
            
            if(response){
                res.json({message:"delete sucessfully"});
            }
        });
        
    }

    update_status (req, res) {
        let table = req.body.table;
        let status = req.body.status;
        let id = req.body.id;
        users.update_status(table,status,id, function(response){
            res.json({message:"update sucessfully"})
        });
    }

    get_child (req, res) {
       
        if(req.session.authenticated == true){
            let is_deleted=0;
            users.get_child(is_deleted,function(response){
                for(let i in response){
                        var year = new Date(response[i].dob).getFullYear();
                        var month =new Date(response[i].dob).getMonth();
                        var date =new Date(response[i].dob).getDate();
                        response[i].dob = year+'-'+month+'-'+date;
                        // response[i].modified = _year+':'+_month+':'+_date;
                }
               
                res.render('users/child',{title:'child Details',response:response,msg:req.flash('msg1'),session:req.session});
            });
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    child_views (req, res) {
        if(req.session.authenticated == true){
            users.view_child_detail(req.query.id,function(response){
                
                res.render('users/child_views',{title:'view  Childs',response:response[0],msg:'',session:req.session});
            
            });
         }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
        
}
    get_appointment (req, res) {
       
        if(req.session.authenticated == true){
            let is_deleted=0;
            users.get_appointment(is_deleted,function(response){
            
                res.render('users/appointment',{title:'Appointment Details',response:response,msg:req.flash('msg1'),session:req.session});
            });
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }

//////////////////////////user crud/////////////////////

/* get_userlist(req, res) {    

    if (req.session.authenticated == true) {
        let is_deleted = 0;
        hospitaldash.get_userlist(is_deleted, function (response) {
            for (var i in response) {
                let date = new Date(response[i].dob).getDate();
                let month = new Date(response[i].dob).getMonth() + 1;
                let year = new Date(response[i].dob).getFullYear();
                var age = mythis.calculateAge(year, month, date);


                response[i].age = age;
            }
            res.render('hospital_admin/hospital_userlist/user_list', { title: 'Illneses', response: response, msg: req.flash('msg1'), session: req.session });
        });
    } else {
        req.flash('msg1', 'Please Login first');
        res.redirect('/admin');
    }
} */
child_views(req,res){

    try{
        if (req.session.authenticated == true) {
            users.child_view(req.query.id, function (response) {
            return res.json(response);
            /* if(response!=''){
                res.render('users/child', { title: 'Edit Users', response:response, msg: '',session: req.session });
               // res.json('1');
               //res.send(response);
            }else{
                res.send(response);
            } */
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/users');
        }
    }catch(e){
        throw e;
    }
}
 async get_child(req,res){
    try{
        
        ///console.log(req.query.id);return false;
        if (req.session.authenticated == true) {
            let Details= await users.get_users_child(req.query.id);
            res.render('users/child', { title: 'Edit Users', response:Details, msg: '',session: req.session });
        }else{

        }
    }catch(er){
        throw er;
    }
}
async update_status_active(req,res){
    try{
        users.update_button(req.body,function(result){
        
            if(result!=''){
                  return res.json('1');
            }else{
                  return res.json('0');
            }
        })
    }catch(error){
        throw error;
    }
}
//////////////////////hash //////////////////////
url(req, res) {
    try {
         users.check_hash(req.params.hash, function (response) {
             console.log(response,'response');
             if (response != '') {
                 res.render('reset_password', { title: 'Reset Password', response: response[0], flash: '', hash: req.params.hash });
            } else {
                 res.status(404).send('Link has been expired!');
             }
         });
    } catch (err) {
        throw err;
    }
}
reset_password(req, res) {
    try {
        users.check_password(req.body,function (result) {
            if (result != '') {
                res.render('success_page', { message: 'Password Changed successfully' });
            } else {
                res.render('success_page', { message: 'Invalid user' });
            }
        });
    } catch (err) {
        throw err;
    }
}

 async viewPolicy(req,res){
try{
    if (req.session.authenticated == true) {
       let getPolicyNumberDetails= await users.getPolicyInfo(req.query);
       if(getPolicyNumberDetails!=0){
        res.render('users/view_policy', { title: 'viewpolicy', response:getPolicyNumberDetails, msg: '',session: req.session });
       }
    }else{
        res.render('users/view_policy', { title: 'viewpolicy', response:'', msg: '',session: req.session });
    }
}catch(err){
    throw err;
}
}
}
