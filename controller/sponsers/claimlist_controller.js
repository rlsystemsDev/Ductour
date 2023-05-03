const Claimlist = require('../../model/sponsers/claimlist_model');

var claimlist='';
module.exports = class claimlist_controller {
    
    constructor(){
        claimlist = new Claimlist();
      
    }

   claim_list (req, res) {
       //console.log(req.session.s_id);return false;
        if(req.session.authkey == true){
        	
            let is_deleted=0;
            claimlist.claim_list(req.session.s_id,function(response){
                
                res.render('sponser_admin/claim_list/index',{title:'Claim List',response:response,msg:req.flash('msg1'),session:req.session});
            });
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsers');
        }
    }
    /* create (req,res) {
        if(req.session.authkey == true){
        	claimlist.get_detail(req.session,(response)=>{
        		
                res.render('sponser_admin/claim_list/create',{title:'Create Claim ',response:response,msg:req.flash('msg1'),session:req.session});
        	});
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsers');
        }
    }
    claim_save (req, res) {
        
        if(req.session.authkey == true){
            if(req.body.user_id != ''){
                 claimlist.update_claim_details(req.body,function(response){
                    
                    if(response == 0){
                        req.flash('msg1', 'Email already taken use another email!');
                        res.redirect('sponsers/create');
                    }else{
                        req.flash('msg1', 'Hospital  updated successfully!');
                        req.session.save(function () {
                            res.redirect('/claimlist/claim_list');
                        });
                        
                    }    
                });
            }else{
                 claimlist.save_claim(req.body,function(response){
                    //console.log(req.body); return false;
                    if(response == 0){
                        req.flash('msg1', 'Email already taken use another email!');
                        res.redirect('/claimlist/create');
                    }else{
                        req.flash('msg1', 'Claim created successfully!');
                            res.redirect('/claimlist/claim_list');
                        
                        
                    }
                    
                });
            }
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsers');
        }
    }
    claim_edit (req, res) {
        if(req.session.authkey == true){
            claimlist.claim_edit(req.query.id,function(response){
                claimlist.get_detail(req.session,(resp)=>{
                    resp.details = response[0]; 
                res.render('sponser_admin/claim_list/create',{title:'Edit Hospital',response:resp,msg:'',session:req.session});
                });
            });
         }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsers');
        }
        
    } */
    claim_view(req,res){
        if(req.session.authkey == true){
            claimlist.view_claim(req.query.id,function(response){
                res.render('sponser_admin/claim_list/claim_view',{title:'view Claimlist',response:response[0],msg:'',session:req.session});
            });
         }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsers');
        }
    }

    async get_illness (req, res)
    {
        try{
            if(req.session.authkey == true){
               let policy_illness_id=await claimlist.get_illness_ids(req.body.id);
               res.json(policy_illness_id);
             }else{
                req.flash('msg1', 'Please Login first');
                res.redirect('/sponsers');
            } 
        }catch(err){
            throw err;
        }
    }
 }