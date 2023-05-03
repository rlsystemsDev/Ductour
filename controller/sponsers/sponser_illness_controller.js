const Sponserillness = require('../../model/sponsers/sponser_illness_model');

var sponserillness = '';
module.exports = class Sponser_illness_controller {

    constructor() {
        sponserillness = new Sponserillness();

    }
    illness_list(req, res) {
        //console.log(req.session.s_id);return false;
        if (req.session.authkey == true) {
            //let is_deleted = 0;
            sponserillness.illness_list(req.session.s_id, function (response) {
                res.render('sponser_admin/illness_list/index', { title: 'Illness List', response: response, msg: req.flash('msg1'), session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/sponsors');
        }
    }
    illness_view(req, res) {

        if (req.session.authkey == true) {
            sponserillness.illness_list(req.query.id, function (response) {
                res.render('sponser_admin/illness_list/illness_view', { title: 'Edit Users', response: response[0], msg: '', session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/hospitaldash');
        }

    }
}