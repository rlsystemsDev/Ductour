const Sponsers = require('../model/sponsers_model');
const Illness = require('../model/illneses_model');
const Helper = require('../config/helper');
var sponsers = '';
var illness = '';
var helpers='';
module.exports = class sponsers_controller {

    constructor() {
        helpers = new Helper;
        sponsers = new Sponsers();
        illness = new Illness();
    }

    sponsers(req, res) {   //for admin login page

        if (req.session.authenticated == true) {
            res.redirect('/sponsers/dashboard');
        } else {
            res.render('sponsers/login', { msg: req.flash('msg1') });
        }
    }

    login(req, res) {    //for sponsers login check

        sponsers.check_login(req.body.email, req.body.password, function (response) {

            if (response != '') {
                var sess = req.session;  //initialize session variable
                req.session.email = response[0].email; //set email as session_id
                req.session.authkey = true;

                res.redirect('/sponsers/dashboard');
            } else {
                req.flash('msg1', 'Invalid Login ');
                res.redirect('/sponsers');
            }
        });

    }
    dashboard(req, res) {   //for admin login page
        if (req.session.authkey == true) {
            res.render('sponsers/dashboard', { msg: req.flash('msg1') })
        } else {
            req.flash('msg1', 'Please login first ');
            res.redirect('/sponsers');
        }
    }
    logout(req, res) {

        req.session.authkey = '';
        req.session.email = ''; //set user id
        req.flash('msg1', 'Logout Success');
        res.redirect('/sponsers');
    }
    profile_update(req, res) {

        if (req.session.authkey == true) {
            res.render('sponsers/profile_edit', { title: 'Profile Update', session: req.session, msg: req.flash('msg1') });

        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    illness(req, res) {

        if (req.session.authenticated == true) {
            let is_deleted = 0;
            illness.get_illneses(is_deleted, function (response) {

                res.render('sponsers/illness_create', { title: 'Illneses', response: response, msg: req.flash('msg1'), session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    edit(req, res) {

        if (req.session.authenticated == true) {
            sponsers.get_sponsers_detail(req.query.id, function (response) {


                res.render('sponsers/edit', { title: 'Edit Sponsers', response: response[0], msg: '', session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    save(req, res) {

        if (req.session.authenticated == true) {
            if (req.body.user_id != '') {

                sponsers.update_sponser_details(req.body, function (response) {

                    if (response == 0) {
                        req.flash('msg1', 'Email already taken use another email!');

                    } else {
                        req.flash('msg1', 'User updated successfully!');
                        req.session.save(function () {
                            res.redirect('/sponsers/dashboard');
                        });

                    }
                });
            } else {

                sponsers.save_illness(req.body, function (response) {

                    if (response == 0) {
                        req.flash('msg1', 'Please Try Again ');
                        res.redirect('/sponsers/edit');
                    } else {
                        req.flash('msg1', 'User created successfully!');
                        req.session.save(function () {
                            res.redirect('/sponsers');
                        });

                    }

                });
            }
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    delete_data(req, res) {

        let table = req.body.table;
        let id = req.body.id;
        sponsers.delete_data(table, id, function (response) {

            if (response) {
                res.json({ message: "delete sucessfully" });
            }
        });

    }
    create(req, res) {

        if (req.session.authenticated == true) {
            res.render('sponsers/edit', { title: 'Create Illness', response: '', msg: req.flash('msg1'), session: req.session });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    healthgames(req, res) {

        if (req.session.authenticated == true) {

            let is_deleted = 0;
            sponsers.get_heal1thgames(is_deleted, function (response) {

                res.render('health_games/healthgames_index', { title: 'Healthgames', response: response, msg: req.flash('msg1'), session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    healthgames_create(req, res) {

        if (req.session.authenticated == true) {
            res.render('health_games/healthgames_create', { title: 'Create Illness', response: '', msg: req.flash('msg1'), session: req.session });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
   async healthgames_save(req, res) {
        try {
            if (req.session.authenticated == true) {

                if (req.body.user_id != '') {
                    let file = '';
                    if (req.files && req.files.file && req.files.file != '') {
                        file = req.files;
                    }
                    sponsers.update_healthgames_details(req.body, file, function (response) {
                        
                        if (response == 0) {
                            req.flash('msg1', 'Email already taken use another email!');
                            //res.redirect('/users/create');
                        } else {
                            req.flash('msg1', 'Health game updated successfully!');
                            res.redirect('/sponsors/healthgames');

                        }
                    });
                } else {

                    sponsers.save_healthgames(req.body, req.files, async function (response) {
                        await helpers.sendHealthGameNotification(req.body);    
                        if (response == 0) {
                            req.flash('msg1', 'Please Try Again ');
                            res.redirect('/sponsers/edit');
                        } else {
                            req.flash('msg1', 'Health game created successfully!');
                            res.redirect('/sponsors/healthgames');

                        }

                    });
                }
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }

        } catch (err) {
            throw err;
        }
    }
    healthgames_edit(req, res) {

        if (req.session.authenticated == true) {

            sponsers.get_heal1thgames(req.query.id, function (response) {


                res.render('health_games/healthgames_create', { title: 'Edit Sponsers', response: response[0], msg: '', session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }

    async get_sponsers(req, res) {
        try {
            
            if (req.session.authenticated == true) {
                //let illness= await sponsers.get_illness();
                let get_sponsers_data = await sponsers.get_sponsers_data();
                if (get_sponsers_data != '') {
                    res.render('sponsors_list/index', { title: 'Sponsers List ', response: get_sponsers_data, msg: req.flash('msg1'), session: req.session });
                } else {
                    res.render('sponsors_list/index', { title: 'Sponsers List', response: '', msg: '', session: req.session });
                }
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }
        } catch (err) {
            throw err;
        }
    }

    async create_sponser(req, res) {
        try {
            if (req.session.authenticated == true) {
                let illness_details = await illness.allIllness();
                res.render('sponsors_list/edit', { title: 'Create Sponser', response:'',illness:illness_details, msg: req.flash('msg1'), session: req.session });
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }
        } catch (err) {
            throw err;
        }
    }

    async save_sposer(req, res) {
        try {
            if (req.session.authenticated == true) {
                if (req.body.user_id != '') {
                    let sponsers_update = await sponsers.update_sponser_detail(req);
                    if (sponsers_update != '') {
                        req.flash('msg1', 'Sponser updated successfully!');
                        res.redirect('/sponsors_list');
                    }
                } else {
                    const sponsers_save = await sponsers.save_sponserss(req);
                    console.log(sponsers_save); 
                    if (sponsers_save == 0) {
                        req.flash('msg1', 'Email Already Exist!');
                        res.redirect('/sponsors_list');
                    } else {
                        req.flash('msg1', 'Sponsers Successfully Created');
                        res.redirect('/sponsors_list');
                    }
                }
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }

        } catch (err) {
            throw err;
        }
    }

    async sponsers_view(req, res) {
        try {
            if (req.session.authenticated == true) {
                if (req.query.id != '') {
                    let sponsers_view = await sponsers.sponsers_view(req.query.id);
                    if (sponsers_view != '') {
                        res.render('sponsors_list/views', { title: 'View Sponser', response: sponsers_view[0], msg: '', session: req.session });
                    }
                }
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }

        } catch (err) {
            throw err;
        }
    }

    async sponser_edit(req, res) {

        try {
            if (req.session.authenticated == true) {
                if (req.query.id != '') {
                    let illneses= await sponsers.illness_name();
                    let sponsers_view = await sponsers.sponsers_edit(req.query.id);
                    
                    if (sponsers_view != '') {
                        res.render('sponsors_list/edit', { title: 'Edit Sponser', response: sponsers_view[0],illness:illneses, msg: '', session: req.session });
                    }
                }
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }
        } catch (err) {
            throw err;
        }
    }

    async get_sponser_with_details(req, res) {
        try {
            if (req.session.authenticated == true) {
                let get_sponsers_data = await sponsers.get_sponsers_data_details(req.body.id);
                res.json(get_sponsers_data);
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }
        } catch (err) {5
            throw err;
        }
    }

    get_name(req, res) {
        try {
            // console.log(req.body.id,'id get'); return false;
            if (req.session.authenticated == true) {
                sponsers.get_sponserid(req.body.id, function (response) {

                    res.send(response);
                    /*    console.log(response);return false;
                    if(response!=''){
                          console.log("already issued ");
                    } */
                });
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }

        } catch (err) {
            throw err;
        }
    }

    check_minValu(req, res) {
        try {
            sponsers.check_minValue(req.body.id, (resu) => {

                res.send(resu[0]);
            });
        } catch (err) {
            throw err;
        }
    }
    async update_status(req,res){
        try{
            if (req.session.authenticated == true) {
                        let result= await  sponsers.change_status(req.body);
                        if(result!=''){
                            return res.json('1');
                    }else{
                            return res.json('0');
                    }
            }else{
                    req.flash('msg1', 'Please Login first');
                    res.redirect('/admin'); 
                } 
        }catch(error){
            throw error;
        }
    }
}