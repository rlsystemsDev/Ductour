const Healthtips = require('../model/healthtips_model');
//const atob = require('atob');
const btoa = require('btoa');
const Helper = require('../config/helper');
var helpers = '';
var healthtips = '';
module.exports = class healthtips_controller {

    constructor() {
        helpers = new Helper;
        healthtips = new Healthtips();
    }
    get_healthtips(req, res) {
        //console.log("req");return false;
        if (req.session.authenticated == true) {
            let is_deleted = 0;
            healthtips.get_healthtips(is_deleted, function (response) {

                res.render('healthtips/index', { title: ' Policy Illneses', response: response, msg: req.flash('msg1'), session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    create(req, res) {
        if (req.session.authenticated == true) {
            res.render('healthtips/add_healthtips', { title: 'Create Healthtips', response: '', msg: req.flash('msg1'), session: req.session });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/healthtips');
        }
    }
    async save(req, res) {
        // console.log(req.body,req.files); return false;
        if (req.session.authenticated == true) {
            if (req.body.user_id != '' && req.body.user_id != undefined) {



                let update_health_tips = await healthtips.update_healthtips(req.body, req.files)

                if (update_health_tips != '') {
                    req.flash('msg1', 'healthtips updated successfully!');
                    req.session.save(function () {
                        res.redirect('/healthtips');
                    });
                } else {
                    req.flash('msg1', 'Error in update!');
                    res.redirect('/healthtips');

                }
            } else {
                let health_save = await healthtips.save_healthtips(req.body, req.files);

                if (health_save != '') {
                    var [getTips] = await healthtips.get_healthtips_data(health_save.insertId);
                   
                    if (getTips.image && getTips.image != '') {
                        getTips.image = req.protocol + "://" + req.host + ":" + req.socket.localPort + "/images/users/" + getTips.image;
                    }


                    if (getTips.video && getTips.video != '') {
                        getTips.video = req.protocol + "://" + req.host + ":" + req.socket.localPort + "/images/users/" + getTips.video;
                    }

                    if (getTips.audio && getTips.audio != '') {
                        getTips.audio = req.protocol + "://" + req.host + ":" + req.socket.localPort + "/images/users/" + getTips.audio;
                    }

                    await helpers.sendHealthTipNotification(getTips);
                    req.flash('msg1', 'healthtips created successfully!');
                    res.redirect('/healthtips');

                } else {
                    req.flash('msg1', 'Error in health creation!');
                    res.redirect('/healthtips');
                }


            }
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }

    async edit(req, res) {
        try {
            if (req.session.authenticated == true) {
                if (req.query.id != '') {
                    let get_healthtips_data = await healthtips.get_healthtips_data(req.query.id);
                    res.render('healthtips/add_healthtips', { title: 'Create Healthtips', response: get_healthtips_data[0], msg: req.flash('msg1'), session: req.session });
                }
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }
        } catch (err) {
            throw err;
        }
    }

    async view(req, res) {
        try {
            if (req.session.authenticated == true) {
                if (req.query.id != '') {
                    let get_healthtips_data = await healthtips.get_healthtips_data(req.query.id);
                    res.render('healthtips/view', { title: 'View Healthtips', response: get_healthtips_data[0], msg: req.flash('msg1'), session: req.session });
                }
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }
        } catch (err) {
            throw err;
        }
    }

}