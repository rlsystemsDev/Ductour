const Faq = require('../model/faq_model');
//const atob = require('atob');
const btoa = require('btoa');

var faq='';
module.exports = class Faq_controller {
    
    constructor () {
       faq = new Faq();    
    }
    get_faq (req, res) {
       // console.log(req);return false;
        if(req.session.authenticated == true){
            let is_deleted=0;
            faq.get_faq(is_deleted,function(response){
                console.log(response); 
                res.render('faq/index',{title:'Faqs',response:response,msg:req.flash('msg1'),session:req.session});
            });
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    
}
