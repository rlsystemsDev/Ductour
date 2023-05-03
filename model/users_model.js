var Helper = require('../config/helper');
var Database = require('../config/database.js');
var path = require('path');
async = require("async");
var db = '';
var Promise = require('promise');
var url = require('url');
console.log(url.parse);

module.exports = class Users_model extends Helper {

    constructor() {
        super();
        db = new Database();
    }
    async get_all_users(is_deletd, callback) {
        try {
            //var age=super.calculate_age(dob);
            const [rows, fields] = await db.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and is_parent=? and otp_is_varified=? ORDER BY id DESC', ['0', '0', '1']);
            
            callback(rows);
        } catch (err) {
            throw err;
        }
    }

    /*  async save_users (data,image,callback) {
        console.log(data,image);return false;
         try{
             var time = Date.now(); 
                 let hash = super.crypt(data.password);
                
             const [row, field] = await db.db_connect.execute('SELECT *  FROM `users` WHERE `is_deleted` = ? and email=?', ['0',data.email]);
             if(row != ''){
                 
                 var rows = 0;
                 
                
             }else{
                 let images = '';
                 if(image!=''){
                    
                     images = super.image_Upload(image);
                 }
                 
                 if(path.extname(images)){
                      images = images;
                 }else{
                      images = ''
                 }
                 var time = Date.now(); 
                 var n = time/1000;
                 time = Math.floor(n); 
                const [rows, fields] = await db.db_connect.execute('insert into users set username=?,address=?,city=?,state=?,dob=?,gender=?,blood_group=?,email=?,image=?,bvn=?,password=?,phone_number=?',[data.username,data.address,data.city,data.state,data.dob,data.gender,data.blood_group,data.email,images,time,hash,data.phoneno]);
                
             }
           
             callback(rows);
         }catch(err){
             throw err;
         }
         
     } */


    async get_user_detail(data, callback) {
        try {
            const [row, field] = await db.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and id=? order by id desc' , ['0', data]);
            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async view_user_detail(data, callback) {
        try {
            const [row, field] = await db.db_connect.execute('SELECT * FROM `users` WHERE  id=?', [data]);

            const [GettingpolicyDetails] = await db.db_connect.execute('select ducmeal_code.code,claim_list.id,claim_list.payment_status, IFNULL(claim_list_illness.policy_number,"") as policy_number,IFNULL(claim_list.id,"") as claim_id,IFNULL(sponser_login.username,"") as sponser_name,IFNULL(hospital_details.name,"") as hospital_name,IFNULL(hospital_details.address,"") as hospital_address,IFNULL(claim_list_illness.expiry_date,"") as policy_expires  from claim_list LEFT JOIN claim_list_illness ON claim_list_illness.claim_request_id=claim_list.id LEFT JOIN illnesses ON claim_list_illness.illness_id=illnesses.id LEFT JOIN hospital_details ON claim_list.hospital_id=hospital_details.id left JOIN sponser_login ON sponser_login.id= claim_list.sponser_id left JOIN ducmeal_code on ducmeal_code.claim_id=claim_list.id where claim_list.user_id=? group by claim_list.id order by claim_list.id desc', [data]);


            const [allIllness] = await db.db_connect.execute('select IFNULL(claim_list.id,"") as claim_id ,IFNULL(illnesses.name,"") as illness_name from claim_list LEFT JOIN claim_list_illness ON claim_list_illness.claim_request_id=claim_list.id LEFT JOIN illnesses ON claim_list_illness.illness_id=illnesses.id LEFT JOIN hospital_details ON claim_list.hospital_id=hospital_details.id left JOIN sponser_login ON sponser_login.id= claim_list.sponser_id where claim_list.user_id=?', [data]);

            let final_data = {
                users: row,
                policyDetails: GettingpolicyDetails,
                allIllness: allIllness
            }

            callback(final_data);
        } catch (err) {
            throw err;
        }
    }

    async delete_data(table, id, callback) {
        try {

            //const [row, field] = await db.db_connect.execute('update ' + table + ' set is_deleted="1" where id=?', [id]);
            const [row, field] = await db.db_connect.execute('delete from  ' + table + ' where id=?', [id]);

            callback(row);
        } catch (err) {
            throw err;
        }
    }

    /* async update_user_details (data,image,callback) {
        
        try{
            
            var time = Date.now();
            let images = ''; 
            if(image!=''){
                 images = super.image_Upload(image);
            }
            // console.log(images);return false;
            if(path.extname(images)){
                 images = images;
            }else{
                 images = ''
            }
            const [row, field] = await db.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and id=?', ['0',data.user_id]);
            if(images== ''){
                images = row[0].image;
                
             }
            
             const [rows, fields] = await db.db_connect.execute('UPDATE `users` SET username = ?, address = ?, city =?, state=?,dob =?,gender =?,blood_group = ?,image=?,phone_number=? where id='+data.user_id+' ', [data.username,data.address,data.city, data.state,data.dob,data.gender,data.blood_group,images,data.phoneno]);
            

             callback(rows);
        }catch(err){
            throw err;
        }
    } */

    async update_status(table, status, id, callback) {
        try {
            const [rows, fields] = await db.db_connect.execute('UPDATE ' + table + ' SET status = ? where id=' + id + ' ', [status]);
            callback(rows);
        } catch (err) {
            if (err) res.json({
                message: err
            });
        }
    }

    create_user(data) {

        try {
            var time = Date.now();
            // var n = time/1000;
            // var time = Math.floor(n);
            return new Promise(async function (resolve, reject) {
                const [row, fields] = await db.db_connect.execute('insert into users set username=?,address=?,city=?,state=?,dob=?,gender=?,bloodgroup=?,email=?,password=?,image=?', [data.username, data.address, data.city, data.state, data.dob, data.gender, data.blood_group, data.email, data.password, files.image])
                if (row) {
                    resolve(row);
                } else {
                    reject("something went wrong");
                }
            });
        } catch (err) {
            throw err;
        }
    }

    async create_user(data, files, user_data, callback) {

        try {
            var time = Date.now();
            let rows = '';
            const [rowss, field] = await db.db_connect.execute('SELECT username,email,status,image,created,modified  FROM `users` WHERE `is_deleted` = ? and email=?', ['0', data.email]);
            //let _image_name= 'http://localhost:5000/images/users/'+files.image;
            let _image_name= 'https://ductour.com:5000/images/users/'+files.image;
            if (rowss == '') {
                const [row, fields] = await db.db_connect.execute('insert into users set username=?,address=?,city=?,state=?,email=?,dob=?,gender=?,bloodgroup=?,password=?,image=?', [data.username, data.address, data.city, data.state, data.dob, data.gender, data.blood_group, data.email, data.password, _image_name]);
                if (row) {
                    const [rowsss, fieldss] = await db.db_connect.execute('SELECT username,email,status,image,created,modified FROM `users` WHERE `is_deleted` = ? and id=?', ['0', row.insertId]);
                    if (rowsss != '') {
                        rows = rowsss
                    }
                }
            }
            callback(rows);
        } catch (err) {
            throw err;
        }
    }
    async check_user(data, user_data, callback) {
        try {
            let rows = '';
            const [row, field] = await db.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and email=? and security_key=?', ['0', data.email, user_data.security_key]);
            if (row) {
                rows = row;
            }
            callback(rows);
        } catch (err) {
            throw err;
        }
    }

    async check_users(data, user_data, callback) {
        try {
            let rows = '';
            let hash = super.crypt(data.password);
            const [row, field] = await db.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and email=? and security_key=? and password=?', ['0', data.email, user_data.security_key, hash]);
            if (row) {
                rows = row;
            }
            callback(rows);
        } catch (err) {
            throw err;
        }
    }

    async login(data, user_data, callback) {
        try {
            var time = Date.now();
            let rows = '';
            let auth = super.create_auth();
            const [row, field] = await db.db_connect.execute('update users set authorization_key=?, modified=?,social_id=?,social_type=? where id="' + user_data[0].id + '" && is_deleted="0"', [auth, time, '', '']);
            if (row != '') {
                const [rowss, field] = await db.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and id=?', ['0', user_data[0].id]);
                if (rowss) {
                    rows = rowss;
                }
            }
            callback(rows);
        } catch (err) {
            throw err;
        }
    }

    async social_login(data, user_data, callback) {
        try {
            var time = Date.now();
            let rows = '';
            let auth = super.create_auth();
            const [row, field] = await db.db_connect.execute('update users set authorization_key=?, modified=?,device_token=?,device_type=?,social_id=?,social_type=?,latitude=?,longitude=?,username=? where id="' + user_data[0].id + '" && is_deleted="0"', [auth, time, data.device_token, data.device_type, data.social_id, data.social_type, data.latitude, data.longitude, data.username]);
            if (row != '') {
                const [rowss, field] = await db.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and id=?', ['0', user_data[0].id]);
                if (rowss) {
                    rows = rowss;
                }
            }
            callback(rows);
        } catch (err) {
            throw err;
        }
    }

    async login_social(data, user_data, callback) {
        try {
            var time = Date.now();
            let rows = '';
            let auth = super.create_auth();
            let password = super.crypt(data.password);
            const [rowss, field] = await db.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and email=?', ['0', data.email]);
            if (rowss == '') {
                const [row, fields] = await db.db_connect.execute('insert into users set email=?,password=?,device_token=?,device_type=?,social_id=?,social_type=?,security_key=?,latitude=?,longitude=?,created=?,modified=?,authorization_key=?,name=?', [data.email, password, data.device_token, data.device_type, data.social_id, data.social_type, user_data.security_key, data.latitude, data.longitude, time, time, auth, data.username])
                if (row) {
                    const [rowsss, fieldss] = await db.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and id=?', ['0', row.insertId]);
                    if (rowsss) {
                        rows = rowsss;
                    }
                }
            }
            callback(rows);
        } catch (err) {
            throw err;
        }
    }

    async update_password(data, user_data, callback) {
        try {
            let password = super.crypt(data.old_password);
            let rows = '';
            const [row, field] = await db.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and id=? and password=?', ['0', user_data.id, password]);
            if (row != '') {
                let new_password = super.crypt(data.new_password);
                const [rowss, fields] = await db.db_connect.execute('update users set password=? where id="' + user_data.id + '" && is_deleted="0"', [new_password]);
                if (rowss != '') {
                    rows = rowss;
                }
            }
            callback(rows);
        } catch (err) {
            throw err;
        }
    }

    async get_hair_style_list(data, callback) {
        try {
            const [row, field] = await db.db_connect.execute(`SELECT   *, (3959 * acos (cos ( radians(${data.latitude}) ) * cos( radians( latitude ) )* cos( radians( longitude ) - radians(${data.longitude}) )+ sin (radians(${data.latitude}) )* sin( radians( latitude ) ))) AS distance FROM barbar HAVING distance < .2 ORDER BY id DESC`)
            let rows = '';
            if (row != '') {
                rows = row;
            }
            callback(rows);
        } catch (err) {
            throw err;
        }
    }

    


    async edit_profile(file, data, user_data, callback) {
        //console.log(data);
        try {
            let rows = '';
            const [row, fields] = await db.db_connect.execute('update users set username=?, address=?,city=?, state=?,image=? where id="' + user_data[0].id + '"', [data.username, data.address, data.city, data.state, images]);
            if (row != '') {
                rows = row;
            }
            callback(rows);
        } catch (err) {
            throw err;
        }
    }


    async get_child(is_deleted, callback) {
        //let is_deleted=0;
        try {
            //var ql='SELECT childs.*,users.`username` FROM `childs` LEFT JOIN users on childs.user_id = users.id' 
            const [row, field] = await db.db_connect.execute('SELECT childs.name,childs.dob,childs.status,users.`username` FROM `childs` JOIN users on childs.user_id = users.id');
            console.log(row,"========gfg"); //return false;

            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async view_child_detail(data, callback) {
        //console.log(data);   
        try {
            const [row, field] = await db.db_connect.execute('SELECT childs.name,childs.dob,childs.status,users.`username` FROM `childs` JOIN users on childs.user_id = users.id');
            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async get_appointment(is_deleted, callback) {
        //let is_deleted=0;
        try {
            //var ql='SELECT appointments.*,users.`username` FROM `appointments` LEFT JOIN users on appointments.user_id = users.id' 
            const [row, field] = await db.db_connect.execute('SELECT appointments.date,appointments.note,users.`username` FROM `appointments`  JOIN users on appointments.user_id = users.id ');

            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async child_view(data, callback) {
        try {

            let final_data = '';
            // if(data!=0){
            const [Details] = await db.db_connect.execute('SELECT * FROM `users` WHERE is_parent=?', [data]);
            final_data = Details;
            // }
            callback(final_data);
        } catch (error) {
            throw error;
        }
    }


    //saving user

    async save_users(data, image, callback) {

        try {

            var time = Date.now();
            let hash = super.crypt(data.password);

            const [row, field] = await db.db_connect.execute('SELECT *  FROM `users` WHERE `is_deleted` = ? and email=?', ['0', data.email]);
            if (row != '') {

                var rows = 0;


            } else {
                let images = '';
                if (image != '') {

                    images = super.image_Upload(image);
                }

                if (path.extname(images)) {
                    images = images;
                } else {
                    images = '';
                }
                //let _image_name= 'http://localhost:5000/images/users/'+images;
                let _image_name= 'https://ductour.com:5000/images/users/'+images;
                var time = Date.now();
                var n = time / 1000;
                time = Math.floor(n);
                let otps = "12345"
                const [rows, fields] = await db.db_connect.execute('insert into users set phone_number=?, username=?,is_parent=?,latitude=?,longitude=?,address=?,city=?,state=?,dob=?,gender=?,blood_group=?,otp=?,email=?,image=?,created=?,password=?', [data.phone, data.username, data.parent_id, data.lat, data.long, data.address, data.city, data.state, data.dob, data.gender, data.blood_group, otps, data.email, _image_name, time, hash]);

                // console.log(rows); 
            }


            callback(rows);

        } catch (err) {
            throw err;
        }

    }
    async update_user_details(data, image, callback) {
        try {

            var time = Date.now();
            let images = '';


            if (image != '') {

                images = super.image_Upload(image);
            }
            //let _image_name= 'http://localhost:5000/images/users/'+images;
            let _image_name= 'https://ductour.com:5000/images/users/'+images;
            //console.log(images);return false;
            if (path.extname(images)) {
                images = images;
            } else {
                images = ''
            }
            const [row, field] = await db.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and id=?', ['0', data.user_id]);
            if (images == '') {

                images = row[0].image;

            }
            let otps = "12334"
            const [rows, fields] = await db.db_connect.execute('UPDATE `users` SET phone_number=?,latitude=?,longitude=?, username = ?,is_parent=?, address = ?, city =?, state=?,dob =?,gender =?,blood_group = ?,image=?,otp=? where id=' + data.user_id + ' ', [data.phone, data.lat, data.long, data.username, data.parent_id, data.address, data.city, data.state, data.dob, data.gender, data.blood_group, _image_name, otps]);
            

            callback(rows);
        } catch (err) {
            throw err;
        }
    }
    async get_users_child(data) {
        try {
            const [List] = await db.db_connect.execute('select *  from users where is_parent=?', [data]);

            console.log('update users set is_seen=? where id=?',[0,data]);

            let update = await db.db_connect.execute('update users set is_seen=? where id=?',[0,data]);
            
            return List;
        } catch (e) {
            throw e;
        }
    }
    async get_child_count(data) {
        try {
            const [List] = await db.db_connect.execute('select * from users where is_parent=?', [data]);
            let Final_count = 0;
            if (List != '') {
                var count = List.length;
                Final_count = count;

            }

            return Final_count;
        } catch (e) {
            throw e;
        }
    }
    async update_button(data, callback) {
        try {
            const [row] = await db.db_connect.execute('update users set active_status=? where id=?', [data.status, data.id]);
            console.log(row);
            callback(row);
        } catch (e) {
            throw e;
        }
    }
    //////////////////////////////api//////////////////
    async add_user(data, headers) {
        try {
            //console.log(data,"===========data.device_token");return false;
            if (headers.device_type == undefined) {
                headers.device_type = ''
            }
            if (headers.device_token == undefined) {
                headers.device_token = ''
            }
            if (data.login_type == 1) {
                let final_data = '';
                let signup_auth = super.create_auth();


                if (data.phone == undefined) {
                    data.phone = ''
                }
                if (data.country_code == undefined) {
                    data.country_code = ''
                }
                //console.log('update users set username=?,dob=?,gender=?,device_token=?,device_type=?,authorization_key=? where social_id=? ', [data.username, data.dob, data.gender, headers.device_token, headers.device_type, signup_auth,data.social_id]);return false;
                const [SaveData] = await db.db_connect.execute('update users set zone_seconds=?, username=?,dob=?,gender=?,device_token=?,device_type=?,authorization_key=? where social_id=? ', [data.seconds,data.username, data.dob, data.gender, headers.device_token, headers.device_type, signup_auth, data.social_id]);
                const [AuthKey] = await db.db_connect.execute('select * from users where social_id=?', [data.social_id]);
                final_data = AuthKey
                // }
                console.log(final_data, 'gg');
                return final_data;

            } else {
                //console.log("in else");return false;
                let final_data = '';
                let signup_auth = super.create_auth();
                
                // console.log('update users set username=?,dob=?,gender=?,device_token=?,device_type=?,country=?,authorization_key=? where phone_number=? and phone_code=? ', [data.username, data.dob, data.gender, headers.device_token, headers.device_type,data.country_name,signup_auth, data.phone, data.country_code]);

                const [SaveData] = await db.db_connect.execute('update users set zone_seconds=?, username=?,dob=?,gender=?,device_token=?,device_type=?,country=?,authorization_key=? where phone_number=? and phone_code=? ', [data.seconds,data.username, data.dob, data.gender, headers.device_token, headers.device_type,data.country_name,signup_auth, data.phone, data.country_code]);
                console.log(SaveData,"======SaveData");

                const [AuthKey] = await db.db_connect.execute('select * from users where phone_number=? and phone_code=?', [data.phone, data.country_code]);
                console.log('select * from users where phone_number=? and phone_code=?', [data.phone, data.country_code],"==========AuthKey");
                final_data = AuthKey
                // }
               // console.log(final_data, 'gg');
                return final_data;
            }
        } catch (err) {
            throw err;
        }
    }
    async add_New_member(data, image, parent) {
        try {
            let image_name = "";
            if (image && image.image != '') {
                image_name = super.new_image_Upload(image.image);
            }
            image_name = (typeof image_name == 'undefined') ? '' : image_name;
           // let _image_name= 'http://localhost:5000/images/users/'+image_name;
            let _image_name= 'https://ductour.com:5000/images/users/'+image_name;
            const [InsertDetails] = await db.db_connect.execute('insert into users set username=?,dob=?,image=?,is_parent=?', [data.name, data.dob, _image_name, parent[0].id]);
            let final_data = ''
            const [Details] = await db.db_connect.execute('select * from users where id=?', [InsertDetails.insertId]);
            if (Details != '') {
                final_data = Details;
            }
            return final_data;
        } catch (err) {
            throw err;
        }
    }
    async update_auths(data, header,body) {
        try {
            var time = Math.floor(Date.now() / 1000);
            let rows = '';
            let authkey = super.create_auth();
           
            //console.log('update users set authorization_key=?,device_token=?,device_type=?,created=?,modifield=? where id=?', [authkey, header.device_token, header.device_type, time, time, data[0].id]);
            console.log('update users set  zone_seconds=?,authorization_key=?,device_token=?,device_type=?,created=?,modifield=? where id=?', [body.seconds,authkey, header.device_token, header.device_type, time, time, data[0].id]);

            const [update] = await db.db_connect.execute('update users set  zone_seconds=?,authorization_key=?,device_token=?,device_type=?,created=?,modifield=? where id=?', [body.seconds,authkey, header.device_token, header.device_type, time, time, data[0].id]);
            
            if (update) {
                const [final_data] = await db.db_connect.execute('select * from users where id=?', [data[0].id]);
                return final_data;
            }


        } catch (err) {
            throw err;
        }
    }
    async check_exist_details(data, header) {
        try {
            let hash = super.crypt(data.password);
            console.log(data.password,"==========data.password");
            console.log('select * from users where username=? and password=?', [data.username, hash]);
            const [get] = await db.db_connect.execute('select * from users where username=? and password=?', [data.username, hash]);
            return get;
        } catch (err) {
            throw err;
        }
    }
    async got_logout(auth) {
        try {
            const [Users] = await db.db_connect.execute('select * from users where authorization_key=?', [auth]);
            const [UpdateAUth] = await db.db_connect.execute('update users  set  device_token=?,authorization_key=? where id=?', [" "," ", Users[0].id]);

            return UpdateAUth;
        } catch (err) {
            throw err;
        }
    }
    async check_auths(auth) {
        try {
            console.log('select * from users where authorization_key=?',[auth])
            const [check] = await db.db_connect.execute('select * from users where authorization_key=?', [auth]);
           // console.log(check,'check');
            return check;
        } catch (error) {
            throw error;
        }

    }
    async check_child_auths(auth) {
        try {
            console.log(auth, "======auth");
            const [check] = await db.db_connect.execute('select * from users where id=?', [auth]);

            return check;
        } catch (error) {
            throw error;
        }

    }
    async check_social_details(data, header) {
        try {
            const [Check] = await db.db_connect.execute('select * from users where email=? and social_id=?', [data.email, data.social_id]);
            return Check;
        } catch (e) {
            throw e;
        }
    }
    async new_Social_login(data, header) {
        try {
            let authkey = super.create_auth();
            var time = Math.floor(Date.now() / 1000);
            const [InsertValue] = await db.db_connect.execute('insert into users set zone_seconds=?, username=?,email=?,social_id=?,social_type=?,device_token=?,device_type=?,authorization_key=?,created=?,otp_is_varified=?', [data.seconds,data.name, data.email, data.social_id, data.social_type, header.device_token, header.device_type, authkey, time,1]);
            console.log(InsertValue, 'InsertValue');
            const [User] = await db.db_connect.execute('select * from users where id=?', [InsertValue.insertId]);

            return User;
        } catch (err) {
            throw err;
        }
    }
    async update_Social_login(data,body) {
        try {

            let authkey = super.create_auth();
            var time = Math.floor(Date.now() / 1000);
            const [InsertValue] = await db.db_connect.execute('update users set zone_seconds=?,authorization_key=?,modifield=? where id=?', [body.seconds,authkey, time, data[0].id]);
            //console.log(InsertValue, 'InsertValue');
            const [User] = await db.db_connect.execute('select * from users where id=?', [data[0].id]);

            return User;
        } catch (err) {
            throw err;
        }
    }
    async check_Valid_Phone(data) {
        try {
            const [result] = await db.db_connect.execute('select * from  users where phone_code=? and phone_number=?', [data.country_code, data.phone]);
            return result;
        } catch (err) {
            throw err;
        }
    }
    async update_unique_hash(data, hash) {
        try {
            const [insert_hash] = await db.db_connect.execute('update users set unique_hash=? where id=?', [hash, data[0].id]);
            return insert_hash;
        } catch (err) {
            throw err;
        }
    }
    async check_hash(data, callback) {
        try {
            const [rows] = await db.db_connect.execute('select * from users where unique_hash=?', [data]);
            console.log(rows,"======================check fromget today");
            callback(rows);
        } catch (err) {
            throw err;
        }
    }
    async check_password(data, callback) {
        try {
           // let new_password = super.cryptHashPass(data.confirm_password);
           let new_password = super.crypt(data.password);
            let rows = '';

            const [row, fields] = await db.db_connect.execute('update users set unique_hash=?,password=? where unique_hash="' + data.hash + '"', ['', new_password]);
            console.log(row, 'password updating');
            if (row != '') {
                rows = row;
            }
            callback(rows);
        } catch (err) {
            throw err;
        }
    }
    async childInfo(userDetails) {
        try {
            console.log('select * from users where is_parent=?', [userDetails[0].id]);
            const [Result] = await db.db_connect.execute('select * from users where is_parent=?', [userDetails[0].id])
            return Result;
        } catch (err) {
            throw err;
        }
    }
    async get_parent(header) {
        try {
            const [Result] = await db.db_connect.execute('select * from users where authorization_key=?', [header]);
            return Result;
        } catch (err) {
            throw err;
        }
    }
    async get_otp(data) {
        try {
            // console.log(data,"=============>");return false;
            let final_data = '';

          // console.log('select * from users where  phone_code=? and phone_number=?', [data.country_code, data.phone])
            const [CheckPhone] = await db.db_connect.execute('select * from users where  phone_code=? and phone_number=?', [data.country_code, data.phone]);
          console.log(CheckPhone != '',"=================CheckPhone");
            if (CheckPhone != '') {
                if (CheckPhone[0].otp_is_varified == 0) {

                    let final_data = '';
                    var digits = '0123456789';
                    var otp = "";
                    for (let i = 0; i < 4; i++) {
                        otp += digits[Math.floor(Math.random() * 10)];
                    }
                    const [Insert] = await db.db_connect.execute('update users set username=?,varify_otp=? where phone_code=? and phone_number=?', [data.name, otp, data.country_code, data.phone]);

                    //console.log(Insert);
                    final_data = otp;
                    var notification = {
                        device_token: data.device_token,
                        title: 'Ductour SignUp Varification Otp',
                        message: "Ductour Signup Varification Code ",
                        notification_code: 6789,
                        body: {
                            otp: final_data, //generated otp
                        }
                    };
                    //console.log(notification);
                   // super.send_otp_notification(notification);
                    return final_data;
                } else {
                    let final_data = ''
                    return final_data;

                }
            } else {
                let final_data = '';
                var digits = '0123456789';
                var otp = "";
                for (let i = 0; i < 4; i++) {
                    otp += digits[Math.floor(Math.random() * 10)];
                }
                console.log(data,"=========data")
                console.log('Insert into users set username=?,phone_code=?,phone_number=?,varify_otp=?,device_token=?,device_type=?', [data.name, data.country_code, data.phone, otp, data.device_token, data.device_type]);
                
                const [Insert] = await db.db_connect.execute('Insert into users set username=?,phone_code=?,phone_number=?,varify_otp=?,device_token=?,device_type=?', [data.name, data.country_code, data.phone, otp, data.device_token, data.device_type]);
                //console.log(Insert);
                final_data = otp;
                var notification = {
                    device_token: data.device_token,
                    title: 'Ductour SignUp Varification Otp',
                    message: "Ductour Signup Varification Code ",
                    notification_code: 6789,
                    body: {
                        otp: final_data, //generated otp
                    }
                };
                //console.log(notification);
               // super.send_otp_notification(notification);

                return final_data;
            }

        } catch (error) {
            throw error;
        }
    }
    async get_resend__otp(data) {
        try {

            const [CheckPhone] = await db.db_connect.execute('select * from users where  phone_code=? and phone_number=?', [data.country_code, data.phone]);
            let final_data = '';

            if (CheckPhone !== '') {
                var digits = '0123456789';
                var otp = "";
                for (let i = 0; i < 4; i++) {
                    otp += digits[Math.floor(Math.random() * 10)];
                }

                const [Insert] = await db.db_connect.execute('update users set  varify_otp=? where phone_code=? and phone_number=?', [otp, data.country_code, data.phone]);
                final_data = otp;

                //Sending Push including otp
                var notification = {
                    device_token: data.device_token,
                    title: 'Ductour SignUp Varification Otp',
                    message: "Ductour Signup Varification Code ",
                    notification_code: 9876,
                    body: {
                        otp: final_data, //generated otp
                    }
                };
                //console.log(notification);
                super.send_otp_notification(notification);


            }
            return final_data;
        } catch (error) {
            throw error;
        }
    }
    async check_otp(data) {
        try {
            const [Result] = await db.db_connect.execute('select * from users where varify_otp=? and (phone_number="' + data.phone + '" && phone_code="' + data.country_code + '")', [data.otp]);
            if (Result != '') {
                const [update_is_varify] = await db.db_connect.execute('update users set otp_is_varified=? where id=?',
                    [1, Result[0].id]);
            }
            return Result;
        } catch (err) {
            throw err;
        }
    }
    async get_users(Detail) {
        try {
            const [result] = await db.db_connect.execute('select * from users where id=?', [Detail[0].id]);
            return result;
        } catch (er) {
            throw er;
        }
    }
    async get_term_condition() {
        try {
            const [Result] = await db.db_connect.execute('select data from content where type=?', [2]);
            return Result;
        } catch (error) {
            console.log(error);
        }
    }
    async getcookie() {
        try {
          
            const [Result] = await db.db_connect.execute('select * from contents where type=?', [4]);
            console.log('select * from content where type=?', [4],"===========");
            return Result;
        } catch (error) {
            console.log(error);
        }
    }
    async get_privacy_policy() {
        try {
            const [Result] = await db.db_connect.execute('select data from content where type=?', [4]);
            return Result;
        } catch (error) {
            console.log(error);
        }
    }
    async check_old_pass(data, header) {
        try {
            // let hash1= super.cryptHashPass(data);
             let hash = super.cryptHashPass(data);
            // console.log(hash1,hash,"========hash1");return false;
            const [User] = await db.db_connect.execute('select id from users where authorization_key=?', [header]);
            const [pass] = await db.db_connect.execute('select * from users where password=? and id=?', [hash, User[0].id]);
           // console.log('select * from users where password=? and id=?', [hash, User[0].id]);return false;
            return pass;
        } catch (err) {
            throw err;
        }
    }
    async change_password(users, newPass) {
        try {
            //let New_pass = super.crypt(newPass);
            let New_pass=super.cryptHashPass(newPass);
           
            const [UpdateDetails] = await db.db_connect.execute('update users set password=? where id=?', [New_pass, users[0].id]);
            console.log(UpdateDetails.affectedRows > 0)
            if (UpdateDetails.affectedRows > 0) {
                const [userDetails] = await db.db_connect.execute('select * from users where id=?', [users[0].id]);
                return userDetails
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        }
    }
    async update_notification(header, data) {
        try {

            const [Update] = await db.db_connect.execute('update users set notification_status=? where id=?', [data, header[0].id]);
            const [users] = await db.db_connect.execute('select * from users where id=?', [header[0].id]);

            return users;

        } catch (error) {
            console.log(error);
        }
    }
    async InsertReview(user, data) {
        try {

            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();

            if (day < 10) {
                var day = "0" + day
            }
            if (month < 10) {
                var month = "0" + month
            }

            let newdate = year + "-" + month + "-" + day;


            const [InsertValue] = await db.db_connect.execute('insert into review set hospital_id=?,user_id=?,rating=?,comment=?,created=?', [data.hospital_id, user[0].id, data.rating, data.comment, newdate]);

            const [updatepushread] = await db.db_connect.execute('update  saving_rating_push set is_read="1" where user_id="' + user[0].id + '"');
            return InsertValue;
        } catch (error) {
            console.log(error);
        }
    }
    async get_review(data, header) {
        try {
            const [ReviewData] = await db.db_connect.execute('select * from review where user_id=? and  hospital_id=?', [header[0].id, data.hospital_id]);
            console.log(ReviewData, 'ReviewData');
            return ReviewData;
        } catch (err) {
            throw err;
        }
    }
    async got_first_password(data, auth) {
        try {
            console.log(data, auth[0].id);
            let final_data = ''
            let hash = super.crypt(data.password);
            console.log(hash);
            const [InsertPass] = await db.db_connect.execute('update users set password=? where id=?', [hash, auth[0].id]);

            if (InsertPass.affectedRows > 0) {
                final_data = InsertPass
            }
            return final_data;
        } catch (err) {
            throw err;
        }
    }
    async checkingUserId(data) {
        try {
            const [datas] = await db.db_connect.execute('select * from users where id=?', [data]);
            return datas;
        } catch (err) {
            throw err;
        }
    }
    async updateEmail(user_id, emailData) {
        try {
            const [Result] = await db.db_connect.execute('update users set email=? where id=?', [emailData, user_id]);
            // console.log(Result,'Result');
            if (Result.affectedRows > 0) {
                return 1;
            } else {
                return 0
            }
        } catch (err) {
            throw err;
        }
    }
    async policy_cron_expire() {
        try {
            var current = Math.floor(Date.now() / 1000)
            /* 
              console.log('SELECT * ,  FROM_UNIXTIME('+current+',"%Y%m%d") as c_d ,  FROM_UNIXTIME(`expiry_date` - 1209600,"%Y%m%d") as d_14 , FROM_UNIXTIME(expiry_date,"%Y%m%d") as ex_d FROM claim_list_illness GROUP by claim_request_id HAVING CAST(c_d AS UNSIGNED) BETWEEN CAST(d_14 AS UNSIGNED) AND CAST(ex_d AS UNSIGNED)');return false; */
            const [query] = await db.db_connect.execute('SELECT * ,  FROM_UNIXTIME(' + current + ',"%Y%m%d") as c_d ,  FROM_UNIXTIME(`expiry_date` - 1209600,"%Y%m%d") as d_14 , FROM_UNIXTIME(expiry_date,"%Y%m%d") as ex_d FROM claim_list_illness GROUP by claim_request_id HAVING CAST(c_d AS UNSIGNED) BETWEEN CAST(d_14 AS UNSIGNED) AND CAST(ex_d AS UNSIGNED)');
            console.log(query,"========query");
            for (let i = 0; i < query.length; i++) {
                /*  console.log(query[i].claim_request_id,'in loop'); */
                const [users] = await db.db_connect.execute('select users.id,users.device_token from users LEFT JOIN claim_list ON claim_list.user_id=users.id LEFT JOIN claim_list_illness ON claim_list.id=claim_list_illness.claim_request_id where claim_list_illness.claim_request_id="' + query[i].claim_request_id + '"GROUP by users.id');
                for (let j = 0; j < users.length; j++) {
                    if (users[j].device_token != '' && users[j].device_token != "0") {

                        var notification = {
                            device_token: users[j].device_token,
                            title: 'Ductour Notification !',
                            message: "Please Renew Your Policy Your Policy Expires Soon !!!",
                            notification_code: 4321,
                            body: {
                                type: 2, // 1 => Hospital Feedback , 2 => Renew Policy Notification

                            }
                        };
                    }
                    console.log(notification, 'notification');
                    super.send_renew_notification(notification);
                }

            }
            //const[users]= await db.db_connect.execute('')
        } catch (err) {
            throw err;
        }
    }
    async update_user_image(image, user) {
        try {
            let _image_names = '';
            _image_names = super.new_image_Upload(image.image);
             //let _image_name= 'http://localhost:5000/images/users/'+_image_names;
            // let _image_name= 'http://3.13.214.27:5000/images/users/'+_image_names;
             let _image_name= 'https://ductour.com:5000/images/users/'+_image_names;
            const [Update] = await db.db_connect.execute('update users set image=? where id=?', [_image_name, user]);
            //const[users]= await db.db_connect.execute('')
            //console.log(Update);
            if (Update.affectedRows > 0) {
                return 1
            } else {
                return 0
            }

        } catch (err) {
            throw err;
        }
    }
    async update_user_blood(data, user) {
        try {
            //console.log(data);

            const [Update] = await db.db_connect.execute('update users set blood_group=? where id=?', [data, user]);
            //const[users]= await db.db_connect.execute('')
            //  console.log(Update);
            if (Update.affectedRows > 0) {
                return 1
            } else {
                return 0
            }

        } catch (err) {
            throw err;
        }
    }
    async get_set_payment() {
        try {
            const [all] = await db.db_connect.execute('select * from payment');
            return all;
        } catch (err) {
            throw err;
        }
    }
    async checkUserExist(data) {
        try {
            const [details] = await db.db_connect.execute('select * from users where id=?', [data]);
            return details;
        } catch (err) {
            throw err;
        }
    }
    async changeImage(image, userId) {
        try {
            // console.log(image);return false;
            let images = super.new_image_Upload(image);
            //let _image_name= 'http://localhost:5000/images/users/'+images;
            let _image_name= 'https://ductour.comL5000/images/users/'+images;
            const [Result] = await db.db_connect.execute('update users set image=? where id=?', [_image_name, userId]);
            const [getDetails] = await db.db_connect.execute('select * from users where id=?', [userId]);
            return getDetails;
        } catch (err) {
            throw err;
        }
    }
    async check_rating_read(userID) {
        try {

            const [getList] = await db.db_connect.execute('select saving_rating_push.* ,hospital_details.name as hospital_name from saving_rating_push LEFT JOIN hospital_details ON hospital_details.id=saving_rating_push.hospital_id  where user_id="' + userID + '" order by id desc');
            return getList;

        } catch (err) {
            throw err;
        }
    }
    async getPolicyInfo(data){
        try{
           //console.log(data);return false;
            // const[getdata]= await db.db_connect.execute('select illnesses.name as illness_name,users.username, hospital_details.name from claim_list LEFT JOIN users on claim_list.user_id=users.id left JOIN hospital_details on claim_list.hospital_id=hospital_details.id left JOIN claim_list_illness on  claim_list_illness.claim_request_id=claim_list.id LEFT JOIN illnesses on  claim_list_illness.illness_id=illnesses.id where users.id=?',[data.userid]);
            const[row]= await db.db_connect.execute('select * from users where id=?',[data.userid]);
            const [GettingpolicyDetails] = await db.db_connect.execute('select IFNULL(claim_list_illness.policy_number,"") as policy_number,IFNULL(claim_list.id,"") as claim_id,IFNULL(sponser_login.username,"") as sponser_name,IFNULL(hospital_details.name,"") as hospital_name,IFNULL(hospital_details.address,"") as hospital_address,IFNULL(claim_list_illness.expiry_date,"") as policy_expires  from claim_list LEFT JOIN claim_list_illness ON claim_list_illness.claim_request_id=claim_list.id LEFT JOIN illnesses ON claim_list_illness.illness_id=illnesses.id LEFT JOIN hospital_details ON claim_list.hospital_id=hospital_details.id left JOIN sponser_login ON sponser_login.id= claim_list.sponser_id where claim_list.user_id=? and claim_list_illness.policy_number=? group by claim_list.id', [data.userid,data.PolicyNum]);
            var allIllness=[];
            if(GettingpolicyDetails.length>0){
            const [all] = await db.db_connect.execute('select IFNULL(claim_list.id,"") as claim_id ,IFNULL(illnesses.name,"") as illness_name from claim_list LEFT JOIN claim_list_illness ON claim_list_illness.claim_request_id=claim_list.id LEFT JOIN illnesses ON claim_list_illness.illness_id=illnesses.id LEFT JOIN hospital_details ON claim_list.hospital_id=hospital_details.id left JOIN sponser_login ON sponser_login.id= claim_list.sponser_id where claim_list.user_id=?', [data.userid]);
            allIllness.push(all);
        }else{
               // allIllness[];
                row=[];
            }
          // console.log(allIllness,"==============allIllness");return false;
            let final_data = {
                users: row,
                policyDetails: GettingpolicyDetails,
                allIllness: allIllness[0]
            }
            //console.log(final_data);return false;
            return final_data;
            
        }catch(err){
            throw err;
        }
    }
    async chnageCountry(data,userId){
        try{
            if(data.country_code==''){
                data.country_code='+234'
            }
            const[chnagedata]= await db.db_connect.execute('update users set phone_code=?,country=? where id=?',[data.country_code,data.country_name,userId]);
            if(chnagedata){
                return 1;
            }else{
                return 0;
            }
        }catch(err){
            throw err;
        }
    }
}