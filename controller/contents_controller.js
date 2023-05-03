var Database = require('../config/database.js');
const Contents = require('../model/contents_model');
const Users = require('../model/users_model');
//const atob = require('atob');
const btoa = require('btoa');
 var db = '';
var users = '';
var contents='';
module.exports = class Contents_controller {
   
    constructor () {
        db = new Database();
        contents = new Contents();  
        users = new Users();  
    }
    term_condition (req, res) {
       // console.log(req);return false;
        if(req.session.authenticated == true){
            let is_deleted=0;
            contents.get_contents(is_deleted,function(response){
                
                res.render('contents/terms',{title:'Contents Details',response:response,msg:req.flash('msg1'),session:req.session});
            });
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
     async update_term (req,res){
         try{
         if(req.session.authenticated == true){
            let updateTerms= await contents.updateTerms(req.body);
            if(updateTerms==1){
                res.redirect('/terms');
            }else{
                res.redirect('/terms');
            }
         }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
         }
         }catch(err){
             throw err;
         }
     }
     async  about_us (req, res) {
         if(req.session.authenticated == true){
             let response= await contents.get_about(req.body);
             res.render('contents/about',{title:'Contents Details',response:response,msg:req.flash('msg1'),session:req.session});
         }else{
             req.flash('msg1', 'Please Login first');
             res.redirect('/admin');
         }
     }
     async update_aboutus(req,res){
        try{
        if(req.session.authenticated == true){
           let updateTerms= await contents.updateAbout(req.body);
           if(updateTerms==1){
               res.redirect('/about_us');
           }else{
               res.redirect('/about_us');
           }
        }else{
           req.flash('msg1', 'Please Login first');
           res.redirect('/admin');
        }
        }catch(err){
            throw err;
        }
    }
    async faq(req,res){
        try{
        if(req.session.authenticated == true){
            let getDetails= await contents.findAllFaqs();
            res.render('faq/faqs',{title:'Contents Details',response:getDetails,msg:req.flash('msg1'),session:req.session});
        }else{
           req.flash('msg1', 'Please Login first');
           res.redirect('/admin');
        }
        }catch(err){
            throw err;
        }
    }
    async faq_hospital(req,res){
        try{
        if(req.session.authenticated == true){
            let getDetails= await contents.findAllFaqsHospital();
            res.render('faq/faqs_hospital',{title:'Contents Details',response:getDetails,msg:req.flash('msg1'),session:req.session});
        }else{
           req.flash('msg1', 'Please Login first');
           res.redirect('/admin');
        }
        }catch(err){
            throw err;
        }
    }
    async update_faqs(req,res){
        try{
            let findthedata= await contents.get_faqs(req.query.id);
            res.render('faq/edit_faqs',{title:'Contents Details',response:findthedata,msg:req.flash('msg1'),session:req.session});
        }catch(err){
            throw err;
        }
    }
    async update_faqs_hospital(req,res){
        try{
            let findthedata= await contents.get_faqs(req.query.id);
            res.render('faq/edit_faqs_hospital',{title:'Contents Details',response:findthedata,msg:req.flash('msg1'),session:req.session});
        }catch(err){
            throw err;
        }
    }
    async update_faqs_data(req,res){
        try{
            let updateFaq= await contents.updatingdata(req.body);
            if(updateFaq==1){
                res.redirect('/faq');
            }else{
                res.redirect('/faq')
            }
        }catch(err){
            throw err;
        }
    }
    async update_faqs_data_hospital(req,res){
        try{
            let updateFaq= await contents.updatingdataHospital(req.body);
            if(updateFaq==1){
                res.redirect('/faq_hospital');
            }else{
                res.redirect('/faq_hospital')
            }
        }catch(err){
            throw err;
        }
    }
    async faq_create(req,res){
        try{
        if(req.session.authenticated == true){
            res.render('faq/add_faqs',{title:'Contents Details',response:'',msg:req.flash('msg1'),session:req.session});
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
        }catch(err){
            throw err;
        }
    }
    async faq_create_hospital(req,res){
        try{
        if(req.session.authenticated == true){
            res.render('faq/add_faqs_hospital',{title:'Contents Details',response:'',msg:req.flash('msg1'),session:req.session});
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
        }catch(err){
            throw err;
        }
    }
    async save_faqs_data(req,res){
        try{
        if(req.session.authenticated == true){
            let saveData= await contents.savefaqs(req.body);
            if(saveData==1){
                res.redirect('/faq');
            }
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
        }catch(err){    
            throw err;
        }
    }
    async save_faqs_data_hospital(req,res){
        try{
        if(req.session.authenticated == true){
            let saveData= await contents.savefaqsHospital(req.body);
            if(saveData==1){
                res.redirect('/faq_hospital');
            }
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
        }catch(err){    
            throw err;
        }
    }
  async terms_conditions_views(req,res){
      try{
        let is_deleted=0;
        contents.get_contents(is_deleted,function(response){
            console.log(response);     
            res.render('terms_view.ejs',{title:'Contents Details',response:response[0].content,msg:req.flash('msg1'),session:req.session});
        });     

      }catch(error){
          throw error
      }
  }
  async privacy_views(req,res){
    try{
      let data= await contents.get_about();
      res.render('privacy_web.ejs',{title:'Contents Details',response:data[0].content,msg:req.flash('msg1'),session:req.session}); 

    }catch(error){
        throw error
    }
}
async cookie_view(req,res){
    try{
      let data= await users.getcookie();
      res.render('cookie_web.ejs',{title:'Cookie Details',response:data,msg:req.flash('msg1'),session:req.session}); 

    }catch(error){
        throw error
    }
}
 get_cookie (req, res) {
       // console.log(req);return false;
        if(req.session.authenticated == true){
            let is_deleted=0;
            contents.get_cookie(is_deleted,function(response){
                
                res.render('contents/cookie',{title:'Contents Details',response:response,msg:req.flash('msg1'),session:req.session});
            });
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
     async update_cookie (req,res){
         try{
         if(req.session.authenticated == true){
            let updateTerms= await contents.updatecookie(req.body);
            if(updateTerms==1){
                res.redirect('/cookie');
            }else{
                res.redirect('/cookie');
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
