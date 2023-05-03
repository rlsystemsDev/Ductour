const Policy = require('../model/policy_model');
//const atob = require('atob');
const btoa = require('btoa');
const Sponsers = require('../model/sponsers_model');
var sponserss = '';
var policy = '';
module.exports = class policy_controller {

    constructor() {
        policy = new Policy();
        sponserss = new Sponsers();
    }
    get_policy(req, res) {
        if (req.session.authenticated == true) {
            let is_deleted = 0;
            policy.get_policy(is_deleted, function (response) {
                for (let i in response) {
                    var year = new Date(response[i].expiry_date).getFullYear();
                    var month = new Date(response[i].expiry_date).getMonth()+1;
                    var date = new Date(response[i].expiry_date).getDate();
                    if(date<10){
                        date= "0"+ date;
                    }
                    if(month<10){
                        month= "0"+ month;
                    }
                    response[i].expiry_date = year + '-' + month + '-' + date;
                    // response[i].modified = _year+':'+_month+':'+_date;
                   
                }
                res.render('policy/index', { title: 'Policy Details', response: response, msg: req.flash('msg1'), session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    views(req, res) {
        if (req.session.authenticated == true) {
            policy.view_policy_detail(req.query.id, function (response) {
                var year = new Date(response[0].expiry_date).getFullYear();
                var month = new Date(response[0].expiry_date).getMonth()+1;
                var date = new Date(response[0].expiry_date).getDate();
                if(date<10){
                        date= "0"+ date;
                    }
                    if(month<10){
                        month= "0"+ month;
                    }
                response[0].expiry_date = year + '-' + month + '-' + date;

                // response[i].modified = _year+':'+_month+':'+_date;


                res.render('policy/views', { title: 'view  Users', response: response[0], msg: '', session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
        // console.log("safd"); return false;
    }

    async create(req, res) {
        if (req.session.authenticated == true) {
            let hmo= await policy.get_hmo();
            let hospital= await policy.get_hospital();
            let illness = await policy.illness_name();
            let sponsers = await policy.get_sponsers();
            let getresturent=  await policy.getmeal();
           /*  let maxvalue = await new Promise(function (resolve, reject) {
                sponserss.check_minValue(req.session, (resu) => {
                    if (resu.length > 0) {
                        resolve(resu[0]);
                    } else {
                        reject('0');
                    }
                });
            }); */
            
            res.render('policy/edit', { title: 'Add policy', response: '', msg: req.flash('msg1'), session: req.session, illness: illness, hmo: hmo,sponsers: sponsers,hospital: hospital,getresturent/*  maxvalue: maxvalue */ });
            // });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/healthtips');
        }
    }

    save(req, res) {
        if (req.session.authenticated == true) {
            if (req.body.user_id != '') {
                console.log(req.body,"==================body");
                policy.update_policy_details(req.body, function (response) {
                    if (response == 0) {
                        req.flash('msg1', '');
                        res.redirect('/policy/create');
                    } else {
                        req.flash('msg1', 'policy updated successfully!');
                        req.session.save(function () {
                            res.redirect('/policy');
                        });

                    }
                });
            } else {
                
                policy.save_policy(req.body, function (response) {
                    if (response == 0) {
                        req.flash('msg1', 'plase try again');
                        res.redirect('/admin');
                    } else {
                        req.flash('msg1', 'Policy  created successfully!');
                        req.session.save(function () {
                            res.redirect('/policy');
                        });

                    }

                });
            }
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async edit(req, res) {
        if (req.session.authenticated == true) {
            policy.get_policy_detail(req.query.id, async function (response) {
                let hmo= await policy.get_hmo();
                let hospital= await policy.get_hospital();
                let illness = await policy.illness_name();
                let sponsers = await policy.get_sponsers();
                let getresturent=  await policy.getmeal();
                let maxvalue = await new Promise(function (resolve, reject) {
                    sponserss.check_minValue(req.session, (resu) => {
                        if (resu.length > 0) {
                            resolve(resu[0]);
                        } else {
                            reject('0');
                        }
                    });
                });
                res.render('policy/edit', { title: 'Edit policy', response: response[0], msg: '', session: req.session, illness: illness, sponsers: sponsers,hmo: hmo,hospital: hospital,getresturent, maxvalue: maxvalue });
                //res.redirect('/policy/create');
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }


}