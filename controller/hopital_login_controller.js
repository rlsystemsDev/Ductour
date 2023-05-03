const Hospitals = require('../model/hopsital_login_model');
//const atob = require('atob');
const btoa = require('btoa');
var Database = require('../config/database.js');
const Helper = require('../config/helper');
var helpers = '';
//var illneses = '';
var db = '';

var hospitals='';
module.exports = class hospital_login_controller {
    
    constructor () {
       hospitals = new Hospitals(); 
       helpers = new Helper;
       db = new Database();
    }
    
    
async hospitals(req,res){
    if(req.session.authenticated == true){
        try{
          let HospitalList= await hospitals.get_hospital_lists();
          let AvgRating=0;
          let HighestRating=0;
          let LowestRating=0;
          for(let i in HospitalList){
              let getAvgRating= await db.db_connect.execute('select IFNULL(avg(rating),0) as AvgRating from review where hospital_id=?',[HospitalList[i].id]);
            
              let getHighestRating= await db.db_connect.execute('select IFNULL(Max(rating),0) as HighestRating from review where hospital_id=?',[HospitalList[i].id]);

              let getLowestRating= await db.db_connect.execute('select IFNULL(MIN(rating),0) as LowestRating from review where hospital_id=?',[HospitalList[i].id]);

              HospitalList[i].AvgRating=parseFloat(getAvgRating[0][0].AvgRating).toFixed(2);
              HospitalList[i].HighestRating=parseFloat(getHighestRating[0][0].HighestRating).toFixed(2);
              HospitalList[i].LowestRating=parseFloat(getLowestRating[0][0].LowestRating).toFixed(2);   
          }
            //req.flash('msg1', 'Hospital Added Successfully');
            res.render('hospitalNew/index',{title:'Hospital Index',response:HospitalList,msg:'',session:req.session}); 
          
        }catch(error){
            throw error;
        }   
   }else{
       req.flash('msg1', 'Please Login first');
       res.redirect('/admin');
   }
}
 async create (req, res) {
        
    if(req.session.authenticated == true){

    let getdata= await db.db_connect.execute('select * from category');
    res.render('hospitalNew/hospital_add',{title:'Create Users',response:'',cat:getdata[0],msg:req.flash('msg1'),session:req.session});
    }else{
        req.flash('msg1', 'Please Login first');
        res.redirect('/admin');
    }
}

save (req, res) {
    //console.log(req.body);return false;
    if(req.session.authenticated == true){
            let files = '';
            if(req.files.file && req.files.file!=''){
                files = req.files;
            }
         
        if(req.body.user_id != ''){
           // users.update_user_details(req.body,files,function(response){
            
                let response= hospitals.update_hospital(req.body,files);
                console.log(response,"============response==0");
                if(response == 0){
                    req.flash('msg1', 'Email already taken use another email!');
                    res.redirect('/hospitals/add');
                }else{
                    req.flash('msg1', 'Hospital  updated successfully!');
                    req.session.save(function () {
                        res.redirect('/hospitals');
                    });
                    
                }    
           // });
        }else{
            //console.log(req.body,"==============in controller");
            //users.save_users(req.body,req.files,function(response){
                let Details= hospitals.save_hospital(req.body,files);
                
                if(Details == 0){
                    req.flash('msg1', 'Email already taken use another email!');
                    res.redirect('/hospitals/add');
                }else{
                    req.flash('msg1', 'Hospital created successfully!');
                    req.session.save(function () {
                        res.redirect('/hospitals');
                    });
                    
                }
                
           // });
        }
    }else{
        req.flash('msg1', 'Please Login first');
        res.redirect('/hospitals');
    }
}
 async edit (req, res) {
    if(req.session.authenticated == true){
        let getdata= await db.db_connect.execute('select * from category');
        hospitals.get_hospital_detail(req.query.id,function(response){
           
            res.render('hospitalNew/hospital_add',{title:'Edit Users',response:response[0],cat:getdata[0],msg:req.flash('msg1'),msg:'',session:req.session});
        });
     }else{
        req.flash('msg1', 'Please Login first');
        res.redirect('/hospitals');
    }   
}
view (req, res) {
    if(req.session.authenticated == true){
        hospitals.view_hospital_detail(req.query.id,function(response){
            
            res.render('hospitalNew/view',{title:'view Hospital',response:response[0],msg:'',msg:req.flash('msg1'),session:req.session});
        });
     }else{
        req.flash('msg1', 'Please Login first');
        res.redirect('/admin');
    }
    
}
update_statuss(req,res){
    try{
       hospitals.updateStatus(req.body,function(result){
        
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

}