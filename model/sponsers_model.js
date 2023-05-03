var Helper = require('../config/helper');
var Database = require('../config/database.js');
async = require("async");
var path = require('path');
var db = '';
module.exports = class sponsers_model extends Helper {

    constructor() {
        super();
        db = new Database();
    }
    async check_login(email, password, callback) {

        try {
            let hash = super.crypt(password);
            const [rows, fields] = await db.db_connect.execute('SELECT * FROM `sponser_login` WHERE `email` = ? AND `password` = ?', [email, hash]);

            var rowss = '';
            if (rows.length > 0) {
                rowss = rows;
            }
            callback(rowss);
        } catch (err) {
            throw err;
        }

    }
    async get_illneses(is_deleted, callback) {
        try {
            const [row, field] = await db.db_connect.execute('SELECT *  FROM `illnesses`WHERE `is_deleted` = ?', ['0']);

            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async get_sponsers_detail(data, callback) {
        try {
            const [row, field] = await db.db_connect.execute('SELECT * FROM `illnesses` WHERE `is_deleted` = ? and id=?', ['0', data]);
            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async update_sponser_details(data, callback) {


        var time = Date.now();
        const [row, field] = await db.db_connect.execute('SELECT * FROM `illnesses` WHERE `is_deleted` = ? and id=?', ['0', data.user_id]);



        const [rows, fields] = await db.db_connect.execute('UPDATE illnesses SET name = ?, description = ? WHERE id = ?', [data.name, data.description, data.user_id]);

        callback(rows);
    } catch(err) {
        throw err;
    }
    async save_illness(data, callback) {

        try {
            var time = Date.now();
            const [rows, fields] = await db.db_connect.execute('insert into illnesses set name=?,description=?', [data.name, data.description]);

            callback(rows);
        } catch (err) {
            throw err;
        }

    }
    async get_heal1thgames(is_deleted, callback) {

        try {
            const [row, field] = await db.db_connect.execute('SELECT *  FROM `health_games`WHERE `is_deleted`= ? order by id DESC ', ['0']);
            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async getAllHealthgames(req) {

        try {
            const [row, field] = await db.db_connect.execute('SELECT *  FROM `health_games`WHERE `is_deleted`= ? order by id DESC ', ['0']);
            var rows = [];
            console.log(req);
            for (var i in row) {

                row[i].thumbnail = req.protocol + "://" + req.host + ":" + req.socket.localPort + "/images/users/" + row[i].thumbnail;
                //console.log(row[i]);
                rows.push(row);
            }
            return rows;
        } catch (err) {
            throw err;
        }
    }
    async save_healthgames(data, file, callback) {
        try {
            let files = '';
            if (file && file != '') {
                files = await super.image_Upload(file);
            }
            var time = Date.now();
            const [rows, fields] = await db.db_connect.execute('insert into health_games set name=?,description=?,url=?,thumbnail=?', [data.name, data.description, data.url, files]);

            callback(rows);
        } catch (err) {
            throw err;
        }

    }
    async update_healthgames_details(data, file, callback) {
        try {

            var time = Date.now();
            const [row, field] = await db.db_connect.execute('SELECT * FROM health_games WHERE is_deleted= ? and id=?', ['0', data.user_id]);
            let files = '';
            if (file && file != '') {
                files = await super.image_Upload(file);
            }
            if (files == '') {
                files = row[0].thumbnail;
            }

            const [rows, fields] = await db.db_connect.execute('UPDATE health_games SET name = ?, description = ?,url=?,thumbnail=? WHERE id = ?', [data.name, data.description, data.url, files, data.user_id]);
            callback(rows);
        } catch (err) {
            throw err;
        }
    }

    async get_sponsers_data() {
        try {

            const [row] = await db.db_connect.execute('SELECT s.*,IFNULL((select GROUP_CONCAT(name) FROM  illnesses where  FIND_IN_SET(id,s.illness_id)  limit 1),"") as illness_name,IFNULL(p.name,"") as p_name from sponser_login as s LEFT JOIN policy_illnesses as pc on pc.sponsorID  = s.id LEFT JOIN illnesses as i on i.id  = pc.illness_id left join policies as p on p.id = pc.policy_id WHERE s.is_deleted = 0 order by id DESC');

            if (row != '') {
                // console.log(row);return false;
                /* 
                for(let i in row){
                    let hospitals = [];
                    const[rows] = await db.db_connect.execute('select hospital_name from  sponsor_hospitals where sponsorID=?',[row[i].id]);
                    if(rows!=''){
                        
                       for(let j in rows){
                            hospitals.push(rows[j].hospital_name);
                       }
                       
                    }
                    
                   row[i].hospital_name = hospitals; 
                } */
                return row;
            } else {
                return false;
            }
        } catch (err) {
            throw err;
        }
    }

    /*  async save_sponsers (data)
     {
         try{
             let image = '';
             if(data.files && data.files.file!=''){
                 image = await super.image_Upload(data.files);
             }
 
             let time = super.time();
             let hash = super.crypt(data.body.password); 
            // var randomstring =Math.floor(Math.random()*90000) + 10000;
            // console.log(randomstring,'pass');return false;
 
             const[row] = await db.db_connect.execute(`insert into sponser_login set username="${data.body.name}",email="${data.body.email}",illness_id="${data.body.illname}",password="${hash}",created=${time},modified=${time},is_deleted="0",image="${image}"`) ;
             
             if(row!=''){
                 return row;
             }else{
                 return false;
             }
         }catch(err){
             throw err;
         }
     } */
    async save_sponserss(data) {
        try {
            //console.log(data.body);return false;
            /* console.log("select * from sponser_login where email=? and is_deleted=?", [data.body.email, 0]) */

            const [row, field] = await db.db_connect.execute("select * from sponser_login where email=? and is_deleted=?", [data.body.email, 0]);
           /*  console.log(row != '', 'row'); */
            if (row != '') {

                var final_data = 0;


            } else {
                let image = '';
                console.log(data.files && data.files.file != '' && data.files.file != null);
                if (data.files && data.files.file != '' && data.files.file != null) {
                    image = await super.image_Upload(data.files);
                } else {
                    image = '';
                }
                let time = super.time();
                var digits = '0123456789';
                var password = '';
                for (let i = 0; i < 4; i++) {
                    password += digits[Math.floor(Math.random() * 10)];
                }
                var hash = super.crypt(password);

                super.send_emails(data.body.email, data.body.name, password);
                console.log(`insert into sponser_login set username="${data.body.name}",email="${data.body.email}",illness_id="${data.body.illname}",password="${hash}",created=${time},modified=${time},is_deleted="0",image="${image}",type="${data.body.sponser_type}"`);
                const [rows] = await db.db_connect.execute(`insert into sponser_login set username="${data.body.name}",email="${data.body.email}",illness_id="${data.body.illname}",password="${hash}",created=${time},modified=${time},is_deleted="0",sponser_message="${data.body.sponser_message}",image="${image}",type="${data.body.sponser_type}"`);
                console.log(row, 'sponsrers');

                let q = "";
                let first = true;
                for (let i in data.body.illname) {
                    if (first) {
                        first = false;
                    }
                    else {
                        q += ",";
                    }
                    q += "(" + rows.insertId + "," + data.body.illname[i] + ")";


                }

                const [SaveSeparateIll_id] = await db.db_connect.execute("INSERT INTO  sponser_illness (sponser_login_id, illness_id) VALUES " + q);
                final_data = SaveSeparateIll_id
            }
            console.log(final_data, 'final_data');
            return final_data;

        } catch (e) {
            throw e;
        }
    }
    async sponsers_view(data) {
        try {

            const [row] = await db.db_connect.execute('SELECT s.*,IFNULL((select GROUP_CONCAT(name) FROM  illnesses where  FIND_IN_SET(id,s.illness_id)  limit 1),"") as illness_name,IFNULL(p.name,"") as p_name from sponser_login as s LEFT JOIN policy_illnesses as pc on pc.sponsorID  = s.id LEFT JOIN illnesses as i on i.id  = pc.illness_id left join policies as p on p.id = pc.policy_id WHERE s.is_deleted = 0 && s.id=? order by id DESC', [data]);

            /*  const[row] = await db.db_connect.execute('select * from sponser_login where is_deleted="0" && id=?',[data]); */
            if (row != '') {

                /* for(let i in row){
                    let hospitals = [];
                    const[rows] = await db.db_connect.execute('select hospital_name from  sponsor_hospitals where sponsorID=?',[row[i].id]);
                    if(rows!=''){
                        
                       for(let j in rows){
                            hospitals.push(rows[j].hospital_name);
                       }
                       
                    }
                    
                   row[i].hospital_name = hospitals; 
                } */
                return row;
            } else {
                return false;
            }
        } catch (err) {
            throw err;
        }
    }
    async illness_name() {
        try {
            /* IFNULL((select GROUP_CONCAT(name) FROM  illnesses where  FIND_IN_SET(id,s.illness_id)  limit 1),"") as illness_name */
            const [row, field] = await db.db_connect.execute("select * from illnesses where is_deleted=?", [0]);
            return row;
        } catch (err) {
            throw err;
        }
    }

    async sponsers_edit(data) {
        try {
            const [row] = await db.db_connect.execute('select * from sponser_login where id=?', [data]);

            if (row != '') {
                return row;
            } else {
                return false;
            }
        } catch (err) {
            throw err;
        }
    }

    async update_sponser_detail(data) {

        try {
            let image = '';
            if (data.files && data.files.file && data.files.file != '') {
                image = await super.image_Upload(data.files);
            }
            let time = super.time();
            const [row] = await db.db_connect.execute('select * from sponser_login where id=?', [data.body.user_id]);
            if (row != '') {
                if (image == '') {
                    image = row[0].image;
                }
                const [rows] = await db.db_connect.execute(`update sponser_login set sponser_message="${data.body.sponser_message}", username="${data.body.name}",image="${image}",illness_id="${data.body.illname}",modified=${time},sponser_message="${data.body.sponser_message}",type="${data.body.sponser_type}" where id=${row[0].id}`);


                ////////
                //updating sponsers_illness
                /////////
                let q = "";
                let first = true;
                for (let i in data.body.illname) {
                    if (first) {
                        first = false;
                    }
                    else {
                        q += ",";
                    }
                    q += "(" + row[0].id + "," + data.body.illname[i] + ")";
                    // let t  = [rows.insertId ,data.hospital[i]];
                    // console.log(t);
                    // data_insert.push(t);

                }

                const [deleteOld] = await db.db_connect.execute('delete from sponser_illness where sponser_login_id=?', [row[0].id]);
                console.log(deleteOld, 'deleteOld');

                const [UpdateSeparateIll_id] = await db.db_connect.execute("INSERT INTO  sponser_illness (sponser_login_id, illness_id) VALUES " + q);

                return UpdateSeparateIll_id;
            }
        } catch (err) {
            throw err;
        }
    }

    async get_sponsers_data_details(data) {
        try {
            const [get_sponsers_data] = await db.db_connect.execute('SELECT s.*,IFNULL(i.name,"") as illness_name,IFNULL(p.name,"") as p_name from sponser_login as s LEFT JOIN policy_illnesses as pc on pc.sponsorID  = s.id LEFT JOIN illnesses as i on i.id  = pc.illness_id left join policies as p on p.id = pc.policy_id WHERE s.is_deleted = 0 && s.id=?', [data]);

            return get_sponsers_data;
        } catch (err) {
            throw err;
        }
    }

    async get_sponserid(data, callback) {
        try {
            // console.log(data,'data in model'); return false;
            const [check_id] = await db.db_connect.execute('select * from policies where sponsorID=?', [data]);
            callback(check_id);
        } catch (err) {
            throw err;
        }
    }

    async check_minValue(data, callback) {
        try {
            const [check_minValue] = await db.db_connect.execute('select max(policy_max) as max FROM policies order by id DESC limit 1');
            callback(check_minValue);
        } catch (err) {
            throw err;
        }
    }
    async change_status(data) {
        try {
            const [row] = await db.db_connect.execute('update sponser_login set status=? where id=?', [data.status, data.id]);
            return row;
        } catch (e) {
            throw e;
        }
    }
}

