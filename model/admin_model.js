var Helper = require('../config/helper');
var Database = require('../config/database.js');
async = require("async");
var path = require('path');
var db = '';
module.exports = class admin_model extends Helper {

    constructor() {
        super();
        db = new Database();
    }

    async check_login(email, password, callback) {

        let hash = super.crypt(password);
        try {
            const [rows, fields] = await db.db_connect.execute('SELECT * FROM `admin` WHERE `email` = ? AND `password` = ?', [email, hash]);
            // console.log(rows); return false;
            var rowss = '';
            if (rows.length > 0) {
                rowss = rows;
            }
            callback(rowss);
        } catch (err) {
            throw err;
        }

    }

    async get_dashboard_data(data, callback) {
        try {

            const [row] = await db.db_connect.execute('select * from users where is_deleted="0" and is_parent="0" and otp_is_varified="1"');

            const [rows] = await db.db_connect.execute('SELECT cl.id from claim_list as cl LEFT join sponsor_hospitals as sh on cl.hospital_id = sh.id LEFT JOIN policies as p ON cl.policy_id = p.id LEFT JOIN users as u ON cl.user_id = u.id LEFT JOIN hospital_login as hl on hl.id = sh.hospital_id ORDER BY cl.id DESC');
            const [rowss] = await db.db_connect.execute('select * from sponser_login where is_deleted="0"');
            const [rowssss] = await db.db_connect.execute('select * from policies where is_deleted="0"');
            var data = {};
            data = {
                users: row.length,
                claim_list: rows.length,
                sponser_login: rowss.length,
                policies: rowssss.length

            };

            callback(data);
        } catch (err) {
            throw err;
        }
    }

    async get_admin_data(data, callback) {
        try {
            const [rows, fields] = await db.db_connect.execute('SELECT * FROM `admin` WHERE `id` = ? ', [data.userId]);
            callback(rows);
        } catch (err) {
            throw err;
        }
    }

    async update_admin_data(data, image, callback) {
        try {
            const [row, field] = await db.db_connect.execute('SELECT * FROM `admin` WHERE `id` = ? ', [data.user_id]);
            if (row != '') {
                var images = '';
                console.log(image != '' || image.length > 0);
                if (image != '' || image.length > 0) {
                    images = super.image_Upload(image);
                    if (path.extname(images)) {
                        images = images;
                    } else {
                        images = ''
                    }
                }
                if (images == '') {
                    images = row[0].photo;
                }

                let time = super.time();
                const [rows, fields] = await db.db_connect.execute('update admin set username=?, modified=?, photo=? WHERE `id` = ' + data.user_id + ' ', [data.username, time, images]);
                if (rows != '') {
                    const [rowss, fieldss] = await db.db_connect.execute('SELECT * FROM `admin` WHERE `id` = ? ', [data.user_id]);
                    callback(rowss);
                }

            }
        } catch (err) {
            throw err;
        }
    }
    async update_setting(data, callback) {
        try {
           
            const [row, fields] = await db.db_connect.execute('SELECT * FROM `settings`');
            if (row == '') {

                var rows = ''
                callback(rows);
            } else {
                var time = Date.now();
               
                const [rows, fields] = await db.db_connect.execute('update settings set is_bvn=?,child_limit=?,sponsor_in_year=?,default_sponsor=?', [data.is_bvn, data.child_limit, data.sponsor_in_year, data.default_sponsor]);
             
                callback(rows);
            }
        } catch (err) {
            throw err;
        }
    }


    async check_admin_password(data, admin_data, callback) {
        try {
          
            let hash = super.crypt(data.old_password);
            const [row, field] = await db.db_connect.execute('SELECT * FROM `admin` WHERE `id` = ? && password=?', [admin_data.userId, hash]);

            if (row == '') {
                 row = '0';
            }
            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async check_admin_passwords(data, callback) {
        try {
                
            let hash = super.crypt(data.old_password);
            let rows = '';
            const [row, field] = await db.db_connect.execute('SELECT * FROM `admin` WHERE `id` = ? && password=?', [1, hash]);

            if (row != '') {
                rows = row;
            }
            callback(rows);
        } catch (err) {
            throw err;
        }
    }
    async update_password(password, data, callback) {
        try {
            let hash = super.crypt(password.old_password);
            const [row, field] = await db.db_connect.execute('SELECT * FROM `admin` WHERE `id` = ? && password=?', [data.userId, hash]);
            if (row == '') {

                var rows = ''
                callback(rows);
            } else {
                var time = Date.now();
                let hash = super.crypt(password.confirm_password);
                const [rows, fields] = await db.db_connect.execute('update admin set password=?,  modified=? WHERE `id` = ' + data.userId + ' ', [hash, time]);

                callback(rows);
            }
        } catch (err) {
            throw err;
        }
    }
    async save_range(data, callback) {
        try {
            const [ill_range] = await db.db_connect.execute('insert into illness_range set ill_range=?', [data.ilnnes_range]);
            callback(ill_range);
        } catch (err) {
            throw err;
        }
    }
    async get_detail(data, callback) {
        try {
            const [get] = await db.db_connect.execute('select id,ill_range from illness_range');
           
            callback(get);
        } catch (err) {
            throw err;
        }
    }
    async update_range(data, callback) {
        try {
            const [update] = await db.db_connect.execute('update  illness_range set ill_range=?', [data.ilnnes_range]);
            callback(update);
        } catch (err) {
            throw err;
        }
    }
    async save_payment(data){
        try{
            const[Insertvalue]= await db.db_connect.execute('insert into payment set top_up_amount=?,renew_amount=?,comment=?',[data.top_up_amount,data.renew_amount,data.comment]);
            console.log(Insertvalue,'Insertvalue=======>')
            if(Insertvalue.insertId==1){
                return 1
            }else{
                return 0 
            }
        }catch(err){
            throw err;
        }
    }
    async update_payment(data){
        try{
            const[UpdateValue]= await db.db_connect.execute('update payment set top_up_amount=?,renew_amount=?,comment=? where id=?',[data.top_up_amount,data.renew_amount,data.comment,data.user_id]);
            if(UpdateValue.affectedRows>=1){
                return 1
            }else{
                return 0
            }
        }catch(err){
            throw err;
        }
    }
    async getDetails(){
        const[all]= await db.db_connect.execute('select * from payment');
    return all;
    }
}