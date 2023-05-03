const Policyillneses = require('../model/policyillneses_model');
//const atob = require('atob');
const btoa = require('btoa');

var policyillneses='';
module.exports = class policyillneses_controller {
    
    constructor () {
        policyillneses = new Policyillneses();    
    }
    get_policyillneses (req, res) {
        //console.log("req");return false;
        if(req.session.authenticated == true){
            let is_deleted=0;
            policyillneses.get_policyillneses(is_deleted,function(response){
                //console.log("response");  return false;
                res.render('policyillneses/index',{title:' Policy Illneses',response:response,msg:req.flash('msg1'),session:req.session});
            });
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
}