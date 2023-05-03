const Illneses = require('../model/illneses_model');
const Helper = require('../config/helper');
//const atob = require('atob');
const btoa = require('btoa');
var Database = require('../config/database.js');
var helpers = '';
var illneses = '';
var db = '';
module.exports = class illneses_controller {

    constructor() {
        helpers = new Helper;
        illneses = new Illneses();
        //super();
        db = new Database();
    }
     async get_illneses(req, res) {
        // console.log(req);return false;
        if (req.session.authenticated == true) {
            let is_deleted=0;
            let getallitem= await db.db_connect.execute('select id,name from item'); //ye sari lisitn hai jo id response me jaegi 

            illneses.get_illneses(is_deleted,  async function (response) {
             
        let itemNameArray = [];
        for (let j in response){
                //   var multi = JSON.parse(response[0].items)
            
                // for(let i in multi) {
                 
                //     let getItemNames = await db.db_connect.execute('select name from item where id = ?',[multi[i]]);
                //     itemNameArray.push(getItemNames[0][0].name);
                 
                // }
                // response[j].multipleItems = itemNameArray;
            }
              
                res.render('illneses/index', { title: 'Illneses', response: response,getallitem:getallitem[0], itemNameArray,msg: req.flash('msg1'), session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }

    async create(req, res) {
        try {
            if (req.session.authenticated == true) {
                let getallitem= await db.db_connect.execute('select * from item');
                res.render('illneses/edit', { title: 'Illneses', response: '',itemlist:getallitem[0], msg: req.flash('msg1'), session: req.session })
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }
        } catch (err) {
            throw err;
        }
    }
    async save(req, res) {
        try {
            if (req.session.authenticated == true) {

                if (req.body.id && req.body.id != '') {

                    let updateIll = await illneses.updateIll(req.body);
                    req.flash('msg1', 'illness updated successfully');
                    res.redirect('/illneses');
                } else {
                    let insertIll = await illneses.insertillness(req.body);

                    await helpers.sendIllnessNotification(req.body);

                    req.flash('msg1', 'illness inserted successfully');
                    res.redirect('/illneses');
                }
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }
        } catch (err) {
            throw err;
        }
    }

    async edit(req, res) {
        try {
            if (req.session.authenticated == true) {
                if (req.query.id && req.query.id != '') {
                    let getIllness = await illneses.getIllnes(req.query.id);
                     let getallitem= await db.db_connect.execute('select * from item');
                    if (getIllness != '') {
                        res.render('illneses/edit', { title: 'Illneses', response: getIllness[0],itemlist:getallitem[0], msg: req.flash('msg1'), session: req.session });
                    } else {
                        req.flash('msg1', 'invalid illness id');
                        res.redirect('/illneses');
                    }

                } else {
                    req.flash('msg1', 'invalid illness id');
                    res.redirect('/illneses');
                }
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }
        } catch (err) {
            throw err;
        }
    }
    update_status(req, res) {
        try {

            illneses.updateStatus(req.body, function (result) {

                if (result != '') {
                    return res.json('1');
                } else {
                    return res.json('0');
                }
            })
        } catch (error) {
            throw error;
        }
    }
    get_items(req, res) {
        // console.log(req);return false;
        if (req.session.authenticated == true) {
            let is_deleted = 0;
            illneses.get_items(is_deleted,function (response) {
                res.render('item/list', { title: 'item,', response: response, msg: req.flash('msg1'), session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async item_create(req, res) {
        try {
            if (req.session.authenticated == true) {
                let getcategory= await db.db_connect.execute('select id,name from category where status=?',[1]);
                res.render('item/add', { title: 'item', response: getcategory[0], msg: req.flash('msg1'), session: req.session })
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }
        } catch (err) {
            throw err;
        }
    }
    async item_save(req, res) {
        try {
            if (req.session.authenticated == true) {

                if (req.body.id && req.body.id != '') {
                    let updateIll = await illneses.updateItem(req.body);
                    req.flash('msg1', 'item Details updated successfully');
                    res.redirect('/admin/item');
                } else {
                    let insertIll = await illneses.saveitems(req.body);
                    //await helpers.sendIllnessNotification(req.body);
                    req.flash('msg1', 'illness inserted successfully');
                    res.redirect('/admin/item');
                }
            } else {
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }
        } catch (err) {
            throw err;
        }
    }
    async item_edit(req, res) {
        try {
            if (req.session.authenticated == true) {
                if (req.query.id && req.query.id != '') {
                    let getcategory= await db.db_connect.execute('select id,name from category where status=?',[1]);

                    let getItems = await illneses.getItem(req.query.id);
                    if (getItems != '') {
                        res.render('item/edit', { title: 'item', response: getItems[0],cat:getcategory[0], msg: req.flash('msg1'), session: req.session });
                    } else {
                        req.flash('msg1', 'invalid item id');
                        res.redirect('/admin/item');
                    }

                } else {
                    req.flash('msg1', 'invalid item id');
                    res.redirect('/admin/item');
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
