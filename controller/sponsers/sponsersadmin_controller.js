const Sponsers = require('../../model/sponsers/sponsers_model');
const Illness = require('../../model/illneses_model');

var sponsers = '';
var illness = '';
module.exports = class Sponsersadmin_controller {

    constructor() {

        sponsers = new Sponsers();
        illness = new Illness();
    }

    sponsers(req, res) {   //for admin login page

        if (req.session.authenticated == true) {
            res.redirect('/sponsors/dashboard');
        } else {
            res.render('sponser_admin/login', { msg: req.flash('msg1') });
        }
    }

    login(req, res) {    //for sponsers login check

        sponsers.check_login(req.body.email, req.body.password, function (response) {
            console.log(response,'response');
            if (response != '') {
                var sess = req.session;  //initialize session variable
                req.session.email = response[0].email; //set email as session_id
                req.session.authkey = true;
                req.session.username= response[0].username; 
                req.session.user_id = response[0].id;
                req.session.s_id = response[0].id;
                req.session.image = response[0].image;
                res.redirect('/sponsors/dashboard');
            } else {
                req.flash('msg1', 'Invalid Login ');
                res.redirect('/sponsors');
            }
        });
       

    }
    async dashboard(req, res) {   //for admin login page
        if (req.session.authkey == true) {
            let dash = await sponsers.get_dashboard_data(req.session.s_id);

            res.render('sponser_admin/dashboard', { response: dash, msg: req.flash('msg1'), session: req.session })
        } else {
            req.flash('msg1', 'Please login first ');
            res.redirect('/sponsors');
        }
    }
    logout(req, res) {

        req.session.authkey = '';
        req.session.email = ''; //set user id
        req.flash('msg1', 'Logout Success');
        res.redirect('/sponsors');
    }

    get_hospitallist(req, res) {
       // console.log(req.session.s_id,'check');return false;
        if (req.session.authkey == true) {
            //let is_deleted = 0;
            sponsers.hospital_list(req.session.s_id, function (response) {

                res.render('sponser_admin/hospital/hospital_get_list', { title: 'Hospital List', response: response, msg: req.flash('msg1'), session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }
    }
    async create(req, res) {
         
        if (req.session.authkey == true) {
            let sponsers_illness = await illness.getIllness(req.session);
            let maxpolicy = await sponsers.maxpolicy(req.session);

            res.render('sponser_admin/hospital/create', { title: 'Create Hospital ', response: '', msg: req.flash('msg1'), session: req.session, sponsers_illness: sponsers_illness, maxpolicy: maxpolicy });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }
    }
    save(req, res) {
        
        if (req.session.authkey == true) {
            if (req.body.user_id != '') {
                
                sponsers.update_hospital_details(req.body, function (response) {

                    if (response == 0) {
                        req.flash('msg1', 'Email already taken use another email!');
                        res.redirect('sponsers/create');
                    } else {
                        req.flash('msg1', 'Hospital  updated successfully!');
                        req.session.save(function () {
                            res.redirect('/sponsors/get_hospitallist');
                        });

                    }
                });
            } else {
                sponsers.save_hospital(req.body, req.session, function (response) {
                    
                    if (response == 0) {
                        req.flash('msg1', 'Email already taken use another email!');
                        res.redirect('/sponsors/create');
                    } else {
                        req.flash('msg1', 'Hospital created successfully!');
                        res.redirect('/sponsors/get_hospitallist');


                    }

                });
            }
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }
    }
    async edit(req, res) {
        if (req.session.authkey == true) {
            sponsers.hospital_edit(req.query.id, async function (response) {
                let sponsers_illness = await illness.getIllness(req.session);
                let maxpolicy = await sponsers.maxpolicy(req.session);
                res.render('sponser_admin/hospital/create', { title: 'Edit Hospital', response: response[0], msg: '', session: req.session, sponsers_illness: sponsers_illness,'maxpolicy':maxpolicy });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }

    }
    async view(req, res) {
        if (req.session.authkey == true) {
            sponsers.hospital_list_view(req.query.id, async function (response) {
                let illness = await sponsers.illnessNames(req.query.id);
                // console.log(illness);return false;
                res.render('sponser_admin/hospital/hospital_view', { title: 'Edit Users', response: response[0], msg: '', session: req.session,illnesses:illness });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }

    }
    get_policies(req, res) {
        //console.log(req.session.s_id);return false;
        if (req.session.authkey == true) {
            //let is_deleted = 0;
            sponsers.get_policy(req.session.s_id, function (response) {
                res.render('sponser_admin/policy/get_policy_list', { title: 'Policy List', response: response, msg: req.flash('msg1'), session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }
    }
    async policy_create(req, res) {
        if (req.session.authkey == true) {

            let get_illness = await sponsers.get_illness();

            res.render('sponser_admin/policy/create', { title: 'Create Polcicy', response: get_illness, msg: req.flash('msg1'), session: req.session, resu_data: '' });
            // });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }
    }
    policy_save(req, res) {

        if (req.session.authkey == true) {
            if (req.body.user_id != '') {
                sponsers.update_policy_details(req.body, function (response) {

                    if (response == 0) {
                        req.flash('msg1', 'Please Try Again');
                        res.redirect('sponsers/policy/create');
                    } else {
                        req.flash('msg1', 'Policy  updated successfully!');
                        req.session.save(function () {
                            res.redirect('/sponsors/get_policies');
                        });

                    }
                });
            } else {
                sponsers.save_policy(req.body, req.session, function (response) {
                    if (response == 0) {
                        req.flash('msg1', 'Please Try Again');
                        res.redirect('/sponsors/policy/create');
                    } else {
                        req.flash('msg1', 'Policy Created  successfully!');
                        res.redirect('/sponsors/get_policies');


                    }

                });
            }
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }
    }
    async policy_edit(req, res) {
        if (req.session.authkey == true) {
            sponsers.policy_edit(req.query.id, async function (response) {
                if (response[0].illness_id != '') {
                    console.log(response[0].illness_id,"========under");
                    response[0].illness_id = JSON.parse(response[0].illness_id);
                }
               // console.log("=======>outer",response[0].illness_id);return false;
                let get_illness = await sponsers.get_illness();
                res.render('sponser_admin/policy/create', { title: 'Edit Hospital', response: get_illness, resu_data: response[0], msg: '', session: req.session });
                // res.render('sponser_admin/policy/create',{title:'Edit Hospital',response:response[0],msg:'',session:req.session});
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors/get_policies');
        }

    }
    policy_view(req, res) {
        if (req.session.authkey == true) {
            sponsers.policy_list_view(req.query.id, function (response) {
                res.render('sponser_admin/policy/view', { title: 'view Policies', response: response[0], msg: '', session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }

    }
    profileupdate(req, res) {
        if (req.session.authkey == true) {

            sponsers.profile_update(req.session.user_id, function (response) {
                res.render('sponser_admin/profile_update', { title: 'Edit Hospital', response: response[0], msg: '', session: req.session });

            })
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors/get_policies');
        }

    }
    profile_save(req, res) {
        if (req.session.authkey == true) {
            let files = '';

            if (req.files && req.files.file && req.files.file != '') {

                files = req.files;
            }
            sponsers.update_sponsors_details(req.body, files, function (response) {

                if (response == 0) {
                    req.flash('msg1', 'error');
                    res.redirect('/sponsors/profileupdate');
                } else {
                    req.session.image = response[0].image;
                    req.flash('msg1', 'Sponsers Details updated successfully!');
                    req.session.save(function () {
                        res.redirect('/sponsors/dashboard');
                    });

                }
            });
        }
    }

    change_password(req, res) {

        if (req.session.authkey == true) {
            sponsers.update_password(req.body, req.session.s_id, function (response) {

                if (response != '') {
                    req.flash('msg1', 'Password Updated');

                } else {
                    req.flash('msg1', 'Error while password update');
                }
                res.redirect('/sponsors/profileupdate');
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }
    }

    async check_password(req, res) {
        try {
            let data = await sponsers.check_password(req.body);
            if (data != '') {
                res.json('1');
            } else {
                res.json('0');
            }
        } catch (err) {
            throw err;
        }
    }

    get_userlists(req, res) {

        if (req.session.authkey == true) {
            let is_deleted = '';
            sponsers.get_userdetails(is_deleted, function (response) {

                res.render('sponser_admin/userlist/get_userlist', { title: 'user List', response: response, msg: req.flash('msg1'), session: req.session });
            })
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }
    }
    view_userlists(req, res) {
        if (req.session.authkey == true) {
            sponsers.view_userslist(req.query.id, function (response) {

                res.render('sponser_admin/userlist/user_view', { title: 'view Users', response: response[0], msg: '', session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }
    }

    async get__details(req, res) {
        try {
            if (req.session.authkey == true) {

                if (req.body.id == '1') {
                    let illness_data = await sponsers.get_illnesses_data_details(req.body.id)
                    res.json(illness_data);
                } else {
                    let policy_data = await sponsers.get_policy_data_details(req.body.id)
                    res.json(policy_data);
                }
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/sponsors');
            }
        } catch (err) {
            throw err;
        }
    }

    view_user_illness(req, res) {
        if (req.session.authkey == true) {
            sponsers.view_user_illness(req.query.id, function (response) {
                res.render('sponser_admin/userlist/illness_view', { title: 'view Users', response: response[0], msg: '', session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }
    }

    view_user_policy(req, res) {
        if (req.session.authkey == true) {
            sponsers.view_user_policy(req.query.id, function (response) {
                res.render('sponser_admin/userlist/policy_view', { title: 'view Users', response: response[0], msg: '', session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }
    }
    async illness_list(req,res){
      try{
          if (req.session.authkey == true) {
          
            let illness= await sponsers.get_illnesses(req.session.user_id);
            res.render('sponser_admin/illness/illness_list', { title: 'view Users', response: illness, msg: '', session: req.session });
        }else{
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }
      }catch(err){ 
          throw err;
      }

}
async hospital_lists(req,res){
    try{
        //console.log(req.session.s_id);return false;
        let Hospital=  await sponsers.get_list(req.session.s_id);
       if(Hospital!=''){
        res.render('sponser_admin/hospital/hospital_get_list', { title: 'view Users', response: Hospital, msg: '', session: req.session });
       }else{
        res.render('sponser_admin/hospital/hospital_get_list', { title: 'view Users', response: Hospital, msg: '', session: req.session });
       }
       
    }catch(err){
        throw err;
    }
}
}