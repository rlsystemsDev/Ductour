const Hmo = require('../model/hmo_model');
var moment = require('moment');
const btoa = require('btoa');
var mythis = '';
var hmo = '';
module.exports = class hmo_controller {

    constructor() {
        hmo = new Hmo();
        mythis = this;
    }

    get_hmo_list(req, res) {
        if (req.session.authenticated == true) {
            let is_deleted = 0;
            hmo.get_hmo_list(is_deleted,function(response){
                res.render('hmo/index', { title: 'Illneses', response: response, msg: req.flash('msg1'), session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
   }
   create (req, res) {
        
    if(req.session.authenticated == true){
            res.render('hmo/create',{title:'Create Users',response:'',msg:req.flash('msg1'),session:req.session});
    }else{
        req.flash('msg1', 'Please Login first');
        res.redirect('/admin');
    }
}
save (req, res) {
    
    if(req.session.authenticated == true){
           /*  let files = '';
            if(req.files.file && req.files.file!=''){
                files = req.files;
            }
        */
          
        if(req.body.user_id != ''){
            
            hmo.update_hmo_details(req.body,function(response){
                
                if(response == 0){
                    req.flash('msg1', 'Email already taken use another email!');
                    res.redirect('/hmo/create');
                }else{
                    req.flash('msg1', 'HMO  updated successfully!');
                    req.session.save(function () {
                        res.redirect('/hmo/get_hmo_list');
                    });
                    
                }    
            });
        }else{
            
            hmo.save_hmo(req.body,function(response){
                
                if(response == 0){
                    req.flash('msg1', 'Email already taken use another email!');
                    res.redirect('/hmo/create');
                }else{
                    req.flash('msg1', 'HMO created successfully!');
                    req.session.save(function () {
                        res.redirect('/hmo/get_hmo_list');
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
        hmo.get_hmo(req.query.id,function(response){
            
            res.render('hmo/create',{title:'Edit Users',response:response[0],msg:'',session:req.session});
        });
     }else{
        req.flash('msg1', 'Please Login first');
        res.redirect('/admin');
    }
    
}
view (req, res) {
    if(req.session.authenticated == true){
        hmo.view_hmo_detail(req.query.id,function(response){
            
            res.render('hmo/views',{title:'view HMO',response:response[0],msg:'',session:req.session});
        });
     }else{
        req.flash('msg1', 'Please Login first');
        res.redirect('/admin');
    }
    
}
update_status(req,res){
    try{
       //console.log(req.body.id,req.body.status);return false;
       hmo.updateStatus(req.body,function(result){
        
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
hmo_login(req,res){
    try{
        res.render('hmo_admin/login',{title:'Create Users',response:'',msg:req.flash('msg1'),session:req.session});  
    }catch(er){
        throw er;
    }
}
login(req, res) {    //for admin login check
    hmo.check_login(req.body.email, req.body.password, function (response) {
       
        if (response != '') {
            var sess = req.session;  //initialize session variable
            req.session.userId = response[0].id; //set user id
            req.session.user = response[0].email;
            req.session.name = response[0].name;
            req.session.photo = response[0].photo;
            req.session.password = response.password;
            req.session.authen = true;
            res.redirect('/agent/dashboard');
        } else {
            req.flash('msg1', 'Invalid Login Credentails');
            res.redirect('/agent');
        }
    });

}
 async dashboard(req, res) {

    if (req.session.authen == true) {
        var is_deleted = 0;
     let response= await  hmo.get_dashboard_data(req.session.userId);
            
            res.render('hmo_admin/dashboard/index', { title: ' HMO Dashboard', response:response, session: req.session });
        
    } else {
        req.flash('msg1', 'Please Login first');
        res.redirect('/agent');
    }
}
logout(req, res) {   //for admin logout
    req.session.authen = false;
    req.session.userId = ''; //set user id
    req.session.user = '';
    req.session.first_name = '';
    req.session.photo = '';
    req.session.password = '';

    req.flash('msg1', 'Logout Success');
    res.redirect('/agent');
}
 async hmo_list(req,res){
    try{
        if(req.session.authen==true){
            let List=  await hmo.get_active_hmo();
            if(List!=''){
                res.render('hmo_admin/hmo_list', { title: 'Hmo Listing', response:List, session: req.session ,msg:req.flash('msg1') });
            }

        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/agent'); 
        }
    }catch(err){
        throw err;
    }
}
async get_policy(req,res){
  try{
    if(req.session.authen==true){
      // console.log(req.session.userId);return false;
        const Result= await hmo.get_hmo_policy(req.session.userId);
       if(Result!=''){
        res.render('hmo_admin/policy_list', { title: 'Policy Listing', response:Result, session: req.session ,msg:req.flash('msg1') }); 
       }else{
        res.render('hmo_admin/policy_list', { title: 'Policy Listing', response:Result, session: req.session ,msg:req.flash('msg1') }); 
       }
    }else{
        req.flash('msg1', 'Please Login first');
            res.redirect('/agent');
    }
  }catch(e){
      throw e;
  }
}
async claim_list(req,res){
    try{
       if(req.session.authen==true){
            const Claim=  await hmo.get_claim(req.session.userId);
            for(let i in Claim){
                let start_date = Math.round(new Date(Claim[i].created_at).getTime() / 1000);
                Claim[i].created_at= moment.unix(start_date).format("YYYY-MM-DD HH:mm");
                Claim[i].expiry_date = moment.unix(Claim[i].expiry_date).format("YYYY-MM-DD HH:mm");
            }
            
        res.render('hmo_admin/claim_list', { title: 'Hmo Listing', response:Claim, session: req.session ,msg:req.flash('msg1') });
       }else{
        req.flash('msg1', 'Please Login first');
        res.redirect('/agent');
       }
    }catch(err){
        throw err;
    }
}
async claim_list_edit(req,res){
    if(req.session.authen==true){
    try{
        let list= await hmo.edit_details(req.query.id);
        res.render('hmo_admin/claim_list_edit', { title: 'Hmo Listing', response:list, session: req.session ,msg:req.flash('msg1') });
    }catch(error){
        throw error;
    }
}else{
       req.flash('msg1', 'Please Login first');
        res.redirect('/agent');
}
}catch(e){
    throw e;
}

async update_claim_status(req,res){
    if(req.session.authen==true){
        try{
            let Result = await hmo.update_details(req.body);
            res.redirect('/agent/claim');
         }catch(error){
             throw error;
         }
}else{
    req.flash('msg1', 'Please Login first');
        res.redirect('/agent');
}
}catch(e){
    throw e;
}
}