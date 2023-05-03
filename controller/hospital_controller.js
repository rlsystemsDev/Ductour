const Hospital = require('../model/hospital_model');
//const atob = require('atob');
const btoa = require('btoa');
const Helper = require('../config/helper');
var hospital='';
var helpers = '';
module.exports = class hospital_controller {
    
    constructor () {
        helpers = new Helper;
       hospital = new Hospital();    
    }
    get_sponsorhospital (req, res) {
       
        if(req.session.authenticated == true){
            let is_deleted=0;
           hospital.get_sponsorhospital(is_deleted,function(response){
               
                res.render('hospital/index',{title:'Sponsor Hospitals',response:response,msg:req.flash('msg1'),session:req.session});
            });
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
   async add_hospital (req, res) {
        
        if(req.session.authenticated == true){
          let policies = await hospital.get_policies();
          
                res.render('hospital/hospital_add',{title:'Create Users',response:'',msg:req.flash('msg1'),session:req.session,policies:policies});
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async save (req, res) {
    if(req.session.authenticated == true){
      
            
            if(req.body.user_id != ''){ 
                hospital.update_hospital_details(req.body,function(response){
                    if(response == 0){
                        req.flash('msg1', 'Email already taken use another email!');
                        res.redirect('/hospital/hospital_add');
                    }else{
                        req.flash('msg1', 'User updated successfully!');
                        req.session.save(function () {
                            res.redirect('/hospital');
                        });
                        
                    }    
                });
            }else{
               
                hospital.save(req.body,async function(response){
                    
                
                    if(response == 0){
                        req.flash('msg1', 'Email already taken use another email!');
                        res.redirect('/hospital/hospital_add');
                    }else{
                        
                        await helpers.sendHospitalNotification(req.body);
                        req.flash('msg1', 'Hospital created successfully!');
                        req.session.save(function () {
                            res.redirect('/hospital');
                        });

                        
                    }
                    
                });
            }
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async edit_hospital (req, res) {
         
        if(req.session.authenticated == true){
          hospital.get_hospital_data(req.query.id, async function(resu){
                    let policies = await hospital.get_policies();
                  res.render('hospital/hospital_edit',{title:'Create Users',response:resu[0],msg:req.flash('msg1'),session:req.session,policies:policies});
            
          })
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }

    async hospital_view (req, res)
    {
        try{    
            if(req.session.authenticated == true){
                let get_hospital_data_view = await hospital.get_hospital_datas(req.query.id); 
                if(get_hospital_data_view!=''){
                    res.render('hospital/view',{title:'Hospital View',response:get_hospital_data_view[0],msg:req.flash('msg1'),session:req.session});
                }
            }else{
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }
        }catch(err){
            throw err;
        }
    }
    
    
}