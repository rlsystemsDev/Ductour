const Admin = require('../model/admin_model');
var Helper = require('../config/helper');
var Database = require('../config/database.js');
var path = require('path');
const { concatSeries } = require('async');
var admins = '';
var db = '';
module.exports = class admin_controller extends  Helper{

    constructor() {
        admins = new Admin();
        super();
        db = new Database();
    }

    admin(req, res) {   //for admin login page
        if (req.session.authenticated == true) {
            res.redirect('/admin/dashboard');
        } else {
            res.render('admin/index', { msg: req.flash('msg1') });
        }
    }
    login(req, res) {    //for admin login check
        admins.check_login(req.body.email, req.body.password, function (response) {
           
            if (response != '') {
                var sess = req.session;  //initialize session variable
                req.session.userId = response[0].id; //set user id
                req.session.user = response[0].email;
                req.session.first_name = response[0].first_name;
                req.session.photo = response[0].photo;
                req.session.password = response.password;
                req.session.siderbar_id=response[0].sidebar_id;
                req.session.authenticated = true;
               
                res.redirect('/admin/dashboard');
            } else {
                req.flash('msg1', 'Invalid Login Credentails');
                res.redirect('/admin');
            }
        });

    }


    logout(req, res) {   //for admin logout
        req.session.authenticated = false;
        req.session.userId = ''; //set user id
        req.session.user = '';
        req.session.first_name = '';
        req.session.photo = '';
        req.session.password = '';

        req.flash('msg1', 'Logout Success');
        res.redirect('/admin');
    }

    dashboard(req, res) {

        if (req.session.authenticated == true) {
            var is_deleted = 0;
            admins.get_dashboard_data(is_deleted, function (response) {
                // console.log(response);return false;
                res.render('dashboard/index', { title: 'Dashboard', response: response, session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }

    profile_update(req, res) {
        if (req.session.authenticated == true) {
            admins.get_admin_data(req.session, function (response) {
                res.render('admin/profile_edit', { title: 'Profile Update', response: response[0], session: req.session, msg: req.flash('msg1') });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }


    update(req, res) {
        if (req.session.authenticated == true) {
            let files = '';
            if (Object.keys(req.files).length > 0) {

                files = {
                    file: req.files.file
                }
            }
            // console.log(req.files && (req.files.file != '' || Object.keys(req.files.file).length > 0));
            console.log(files);
            admins.update_admin_data(req.body, files, function (response) {
                if (response != '') {
                    req.session.photo = response[0].photo;
                }
                req.flash('msg1', 'Profile Updated');
                res.redirect('/admin/profile_update');
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    setting_edit(req, res) {
        if (req.session.authenticated == true) {
            res.render('admin/setting_edit', { title: 'setting', response: '', msg: req.flash('msg1'), session: req.session });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }

    }
    update_setting(req, res) {
        // console.log(req.body); 
        if (req.session.authenticated == true) {
            admins.update_setting(req.body, function (response) {


                req.flash('msg1', 'Profile Updated');
                res.redirect('/admin/dashboard');
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }

    check_password(req, res) {
        if (req.session.authenticated == true) {

            admins.check_admin_password(req.body, req.files, function (response) {
                console.log(response);
                // res.json({message:"sucessfully"})
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    check_admin_password(req, res) {
        if (req.session.authenticated == true) {

            admins.check_admin_passwords(req.body, function (response) {
                if (response != '') {
                    res.json({ message: "sucessfully" })
                } else {
                    res.json({ message: "error" })
                }
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }

    change_password(req, res) {
        if (req.session.authenticated == true) {
            admins.update_password(req.body, req.session, function (response) {

                if (response != '') {
                    req.flash('msg1', 'Password Updated');

                } else {
                    req.flash('msg1', 'Error while password update');
                }
                res.redirect('/admin/profile_update');
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    illness_range(req, res) {
        if (req.session.authenticated == true) {
            admins.get_detail(req.query.id, function (response) {

                res.render('illness/illness_range', { title: 'Edit Users', response: response, msg: '', session: req.session });
            });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }

    }
    illness_save(req, res) {
        if (req.body.user_id == '') {

            admins.save_range(req.body, function (resp) {
                if (resp != '') {
                    req.flash('msg1', 'Range Selected Successfully');

                } else {
                    req.flash('msg1', 'Error while Selecting Range');
                }
                res.redirect('/admin/illness_range');
            });
        } else {
            admins.update_range(req.body, function (respo) {

                req.flash('msg1', 'Range updated Successfully');
                res.redirect('/admin/illness_range');


            });
        }
    }
     async set_payment(req, res) {
        if (req.session.authenticated == true) {
        let getPayment= await admins.getDetails();
            if(getPayment==''){
                res.render('payment/index', { title: 'payment', response:'',msg: req.flash('msg'), session: req.session });
            }else{
            res.render('payment/index', { title: 'payment', response:getPayment[0], msg: req.flash('msg'), session: req.session });
            }
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }

    }
    async payment_save(req,res){
        try{
          
           if(req.body.user_id==''){
                let insertAmount = await admins.save_payment(req.body);
                if(insertAmount==1){
                     req.flash('msg1', 'Payment set Successfully');
                     res.redirect('/set_payment');
                }else{
                     req.flash('msg1', 'Problem While set Payment');
                     res.redirect('/set_payment');
                }
           }else{
            let updateAmount = await admins.update_payment(req.body);
            if(updateAmount==1){
                 req.flash('msg1', 'Payment set Successfully');
                 res.redirect('/set_payment');
            }else{
                 req.flash('msg1', 'Problem While set Payment');
                 res.redirect('/set_payment');
            }
           }
        }catch(err){
            throw err;
        }
    }
    async category(req, res) {   //for admin login page
        if (req.session.authenticated == true) {
            let getcategory= await db.db_connect.execute('select * from category order by id desc');
          
            res.render('category/index', { title: 'category', response: getcategory[0], session: req.session, msg: req.flash('msg1') });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    add_category(req, res) { 
        if (req.session.authenticated == true) {
            res.render('category/add', { title: 'category', response: '', session: req.session, msg: req.flash('msg1') });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async category_save(req,res){
        try{
            if (req.session.authenticated == true) {

                let files = '';
                if (req.files && req.files != '') {
                    files = await super.image_Upload(req.files);
                }

                let savecategory= await db.db_connect.execute('insert into category set name=?,image=?,status=?',[req.body.name,files,1]);

                if(savecategory){
                    req.flash('msg1', 'Category Added !!');
                    res.redirect('/get_category');
                }else{
                    req.flash('msg1', 'Please try again');
                    res.redirect('/add_category');
                }
                //console.log(req.body,files);return;
            }else{
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }
        }catch(err){
            throw err;
        }

    }
     async edit_category(req, res) {   //for admin login page
        if (req.session.authenticated == true) {
            let getdata= await db.db_connect.execute('select * from category where id =? order by id desc',[req.query.id]);
           
            res.render('category/edit', { title: 'category', response: getdata[0], session: req.session, msg: req.flash('msg1') });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async update_category(req,res){
        try{
            if (req.session.authenticated == true) {
                let files = '';
             
                if (req.files && req.files.file) {
                    files = await super.image_Upload(req.files);
                }else{
                    let getimage= await db.db_connect.execute('select image from category where id="'+req.body.user_id+'"');
                    console.log(getimage[0][0],"=======ff");
                    files=getimage[0][0].image
                }
            
                let updatevalue= await db.db_connect.execute('update category set name=?,image=? where id=?',[req.body.name,files,req.body.user_id]);
               
                if(updatevalue){
                    req.flash('msg1', 'Category Updated !!');
                    res.redirect('/get_category');
                }else{
                    req.flash('msg1', 'Please try again');
                    res.redirect('/add_category');
                }

                
            }else{
                req.flash('msg1', 'Please Login first');
                res.redirect('/admin');
            }
        }catch(err){
            throw err;
        }
    }
    async view_category(req, res) {   //for admin login page
        if (req.session.authenticated == true) {
            let getdata= await db.db_connect.execute('select * from category where id =?',[req.query.id]);
           
            res.render('category/view', { title: 'category', response: getdata[0], session: req.session, msg: req.flash('msg1') });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async delete_category(req, res) {
        if (req.session.authenticated == true) {
               let getdata= await db.db_connect.execute('delete from category  where id=?',[req.body.id]);
               if(getdata==1){
                   res.send("1")
               }else{
                   res.send("0");
               }
                
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
     async employeeList(req, res) {
        if (req.session.authenticated == true) {
            let getadmin= await db.db_connect.execute('select * from admin where id!=?',[1]);
            res.render('admin/employeelist', { title: 'employee', response:getadmin[0], session: req.session, msg: req.flash('msg1') });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async employeecreate(req, res) {
        if (req.session.authenticated == true) {
            res.render('admin/employeeadd', { title: 'employee', response:'', session: req.session, msg: req.flash('msg1') });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async employeesave(req, res) {
        if (req.session.authenticated == true) {
            let images='';
            if (req.files != '') {

                images = super.image_Upload(req.files);
            }

            let data=req.body;
            console.log(data);
            let hash = super.crypt(data.password);
            data.permission=data.permission. join(",");
            // const [row, fields] = await db.db_connect.execute('insert into admin set username=?,email=?,password=?,photo=?,sidebar_id=?', [data.username, data.email, data.password,images,data.permission]);

            const [row, fields] = await db.db_connect.execute('insert into admin set username=?,email=?,photo=?,sidebar_id=?,password=?', [data.username,data.email,images,data.permission,hash]);

          

            req.flash('msg1', ' Employee Created');
            res.redirect('/admin/dashboard');

        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
     async employeeedit(req, res) {
        if (req.session.authenticated == true) {
          let getadmindata= await db.db_connect.execute('select * from admin where id=?',[req.query.id]);
          let s_ids = getadmindata[0][0].sidebar_id.split(',');
          console.log(getadmindata[0]);
          res.render('admin/employeeedit', { title: 'Profile Update', response: getadmindata[0][0],s_ids:s_ids, session: req.session, msg: req.flash('msg1') });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async employeeupdate(req, res) {
        if (req.session.authenticated == true) {
            // let checkoldvalue= await db.db_connect.execute('select * from admin where id=?',[req.body.user_id]);
            // let images='';
            // if (req.files!=='' || req.files!={}) {

            //     images = super.image_Upload(req.files);
            // }else{
            //     image=checkoldvalue[0][0].photo
            // }

            let data=req.body;
            console.log(data);
            data.permission=data.permission. join(",");
            // const [row, fields] = await db.db_connect.execute('insert into admin set username=?,email=?,password=?,photo=?,sidebar_id=?', [data.username, data.email, data.password,images,data.permission]);
            console.log('update  admin set username=?,email=?,sidebar_id=? where id=?', [data.username,data.email,data.permission,req.body.user_id]);
            const [row, fields] = await db.db_connect.execute('update  admin set username=?,email=?,sidebar_id=? where id=?', [data.username,data.email,data.permission,req.body.user_id]);

          

            req.flash('msg1', ' Employee Updated ');
            res.redirect('/admin/dashboard');

        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
}