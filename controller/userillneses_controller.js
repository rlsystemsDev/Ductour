const userillneses = require('../model/userillneses_model');
//const atob = require('atob');
const btoa = require('btoa');

let userill='';
module.exports = class userillneses_controller {
    
    constructor () {
        userill = new userillneses();    
    }

    get_userillneses (req, res) {
        if(req.session.authenticated == true){
        
            let is_deleted=0;

            userill.get_userillneses(is_deleted,function(response){
                console.log(response); 
                res.render('userillneses/index',{title:' User Illneses',response:response,msg:req.flash('msg1'),session:req.session});
            });
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
}
