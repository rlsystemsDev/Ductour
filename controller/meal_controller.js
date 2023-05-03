//const Illneses = require('../model/illneses_model');
const Helper = require('../config/helper');
//const atob = require('atob');
const btoa = require('btoa');
var Database = require('../config/database.js');
var path = require('path');
var helpers = '';
//var illneses = '';
var db = '';
module.exports = class illneses_controller {

    constructor() {
        //super();
        helpers = new Helper;
       // illneses = new Illneses();
       
        db = new Database();
    }
     async get_meal(req, res) {
        if (req.session.authenticated == true) {
                let getdata= await db.db_connect.execute('select * from ducmeal order by id desc');
                res.render('ducmeal/index', { title: 'meal', response: getdata[0] ,msg: req.flash('msg1'), session: req.session });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async add(req, res) {
        if (req.session.authenticated == true) {

                res.render('ducmeal/meal_add', { title: 'meal', response: '' ,msg: req.flash('msg1'), session: req.session });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async save(req, res) {
        if (req.session.authenticated == true) {
            var data=req.body;
                 var images='';
               if(req.files!=''){
                  
                   images = helpers.image_Upload(req.files);
               }
               
               if(path.extname(images)){
                    images = images;
               }else{
                    images = ''
               }
               var time = Date.now(); 
               var digits = '0123456789'; 
               var password = ''; 
               for (let i = 0; i < 4; i++ ) { 
                   password += digits[Math.floor(Math.random() * 10)]; 
               } 
               var hash= helpers.crypt(data.password);

               helpers.send_rest_email(data.email,data.name,data.password);
               
              let savedata= await db.db_connect.execute('insert into ducmeal set name=?,group_code=?,email=?,password=?,address=?,image=?,lat=?,longi=?',[data.name,data.group_code,data.email,hash,data.address,images,data.lat,data.long]);


             
              
              if(savedata){
                req.flash('msg1', 'Restuarent Added !!');
                res.redirect('/get_meal');
              }else{
                req.flash('msg1', 'Please try again!');
                res.redirect('/meal/add');
              }
                
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async edit(req, res) {
        if (req.session.authenticated == true) {
                let getdata= await db.db_connect.execute('select * from ducmeal where id=?',[req.query.id]);
                res.render('ducmeal/meal_edit', { title: 'meal', response: getdata[0] ,msg: req.flash('msg1'), session: req.session });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async update(req, res) {
        if (req.session.authenticated == true) {

            let files = '';
                if(req.files.file && req.files.file!=''){
                    files = req.files;
                }
    
            var data=req.body;

           var images='';
           let oldimage= await db.db_connect.execute('select * from ducmeal where id=?',[data.user_id]);   
            if(files!==''){
               if(req.files){
                    console.log("here");
                   images = helpers.image_Upload(files);
               }
               if(path.extname(images)){
                    images = images;
               }else{
                   images = ''
               }
            }else{
                
                if(oldimage[0].length>0){
                    if(oldimage){
                        images=oldimage[0][0].image
                    }
                }else{
                    images='';
                }
               
            }
            //    var time = Date.now(); 
            //    var digits = '0123456789'; 
            //    var password = ''; 
            //    for (let i = 0; i < 4; i++ ) { 
            //        password += digits[Math.floor(Math.random() * 10)]; 
            //    } 
            //    var hash= helpers.crypt(data.password);
             if(req.body.lat=='' || req.body.longi ==''){
                 data.lat= oldimage[0][0].lat;
                 data.long=oldimage[0][0].longi;
             }
              let savedata= await db.db_connect.execute('update  ducmeal set name=?,email=?,address=?,image=? ,lat=?,longi=?,group_code=? where id=?',[data.name,data.email,data.address,images,data.lat,data.long,data.group_code,data.user_id]);
              if(savedata){
                req.flash('msg1', 'Restuarent Details Updated !!');
                res.redirect('/get_meal');
              }else{
                req.flash('msg1', 'Please try again!');
                res.redirect('/meal/add');
              }
                
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async view(req, res) {
        if (req.session.authenticated == true) {
                let getdata= await db.db_connect.execute('select * from ducmeal where id=?',[req.query.id]);
                res.render('ducmeal/view', { title: 'meal', response: getdata[0] ,msg: req.flash('msg1'), session: req.session });
        } else {
            req.flash('msg1', 'Please Login first');
            res.redirect('/admin');
        }
    }
    async  update_statuss(req,res){
        console.log(req.body,"==================in body")
        try{
            let updatedata= await db.db_connect.execute('update ducmeal set status=? where id=?',[req.body.status,req.body.id]);
          
            
               if(updatedata!=''){
                     return res.json('1');
               }else{
                     return res.json('0');
               }
          
        }catch(error){
            throw error;
        }
    }
    async delete(req, res) {
        if (req.session.authenticated == true) {
               let getdata= await db.db_connect.execute('delete from ducmeal  where id=?',[req.body.id]);
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
}
