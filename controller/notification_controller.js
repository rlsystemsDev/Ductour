const Notifications = require('../model/notification_model');
const Helper = require('../config/helper');
//const atob = require('atob');
const btoa = require('btoa');

var mythis = '';
var helpers = '';
var notifications = '';
module.exports = class Notifications_controller {

  constructor() {
    helpers = new Helper;
    notifications = new Notifications();
    mythis = this;
  }

  async get_notifications(req, res) {
    try {
      if (req.session.authenticated == true) {
        let get_notification = await notifications.get_notification();
        res.render('notifications/index', {
          title: 'Notifications',
          response: get_notification,
          msg: '',
          session: req.session
        });

      } else {
        req.flash('msg1', 'Please Login first');
        res.redirect('/admin');
      }
    } catch (err) {
      throw err;
    }
  }

  async views(req, res) {
    try {
      if (req.session.authenticated == true) {
        let get_notification = await notifications.get_notification_view(req.query.id);
        res.render('notifications/views', {
          title: 'Notifications',
          response: get_notification,
          msg: '',
          session: req.session
        });

      } else {
        req.flash('msg1', 'Please Login first');
        res.redirect('/admin');
      }
    } catch (err) {
      throw err;
    }
  }
  async sendnotificationview(req, res) {
    try {
      if (req.session.authenticated == true) {

        res.render('notifications/send', {
          title: 'Send Notifications',
          msg: '',
          session: req.session
        });
       // res.redirect('/admin/dashboard');

      } else {
        req.flash('msg1', 'Please Login first');
        res.redirect('/admin');
      }
    } catch (err) {
      throw err;
    }
  }
  async sendnotifications(req, res) {
    try {
      if (req.session.authenticated == true) {
        console.log("hi1");

        if (req.body.title && req.body.description) {

          // res.render('notifications/send', {
          //   title: 'Send Notifications',
          //   msg: 'Notifications Successfully Sent',
          //   session: req.session
          // });
          let sendtoAll = await helpers.sendAdmin(req.body);
          res.redirect('/admin/dashboard');
        }
        // } else {
        //   console.log("hi2");
        //   res.render('notifications/send', {
        //     title: 'Send Notifications',
        //     msg: 'Kindly send notification title and body',
        //     session: req.session
        //   });
        // }
      } else {
        req.flash('msg1', 'Please Login first');
        res.redirect('/admin');
      }
    } catch (err) {
      // console.log("hi3");
      throw err
      res.redirect('/admin/dashboard');
    }
  }


}