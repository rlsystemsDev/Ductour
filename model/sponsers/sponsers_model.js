var Helper = require('../../config/helper');
var Database = require('../../config/database.js');
async = require("async");
var path = require('path');
var db = '';
module.exports = class Sponsers_model extends Helper {

    constructor() {
        super();
        db = new Database();
    }
    async check_login(email, password, callback) {
        let hash = super.crypt(password);

        try {
            console.log('SELECT * FROM `sponser_login` WHERE `email` = ? AND `password` = ?', [email, hash]);
            const [rows, fields] = await db.db_connect.execute('SELECT * FROM `sponser_login` WHERE `email` = ? AND `password` = ?', [email, hash]);
            console.log(rows,'rows');
            var rowss = '';
            if (rows.length > 0) {
                rowss = rows;
            }
            callback(rowss);
        } catch (err) {
            throw err;
        }

    }
    async hospital_list(data, callback) {
        try {
            console.log(data,'s_id');
            //var ql='SELECT appointments.*,users.`username` FROM `appointments` LEFT JOIN users on appointments.user_id = users.id' 
            const [row, field] = await db.db_connect.execute('select hl.id,IFNULL(s.username,"") as s_username,IFNULL(sh.location,"") as sh_location,IFNULL(hl.username,"") as hl_username,IFNULL(hl.email,"") as hl_email from hospital_login as hl left JOIN sponsor_hospitals as sh ON hl.id = sh.hospital_id left JOIN sponser_login as s ON s.id = sh.sponsorID WHERE  hl.is_deleted="0"and  sh.sponsorID=? ORDER BY hl.id DESC',[data]);

            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async save_hospital(data, session, callback) {
        try {
            //console.log(data,session);return false;
            var time = super.time();
            let rowsss = '';
            let hash = super.crypt(data.password);
            const [row, field] = await db.db_connect.execute('SELECT *  FROM `hospital_login` WHERE `is_deleted` = ? and email=?', ['0', data.email]);
            if (row != '') {

                rowsss = 0;

            } else {
                let otp = '123456';
                const [rows, fields] = await db.db_connect.execute('insert into hospital_login set username=?,email=?,password=?,created=?,modified=?,otp=?,illnessIds=?', [data.name, data.email, hash, time, time, otp, data.illname]);
                const [rowss, field] = await db.db_connect.execute('insert into sponsor_hospitals set sponsorID=?,location=?,lat=?,longi=?,hospital_id=?,created=?,modified=?', [session.s_id, data.location,data.lat,data.long,rows.insertId, time, time]);

                if (rowss != '') {
                    rowsss = rowss;
                }
            }
            
            callback(rowsss);
        } catch (err) {
            throw err;
        }

    }

    async hospital_edit(data, callback) {
        try {
            const [row] = await db.db_connect.execute('SELECT hl.*,sh.location from hospital_login as hl left JOIN sponsor_hospitals as sh ON hl.id=sh.hospital_id WHERE hl.id=?', [data]);
            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async update_hospital_details(data, callback) {
        try {
            //console.log(data);return false;
            let rowsss = '';
            

            const [rows, fields] = await db.db_connect.execute('UPDATE `hospital_login` SET username = ?,illnessIds=?,policy_from=?,policy_to=? where id=' + data.user_id + '', [data.name, data.illname,data.policy_min,data.policy_max]);
            const [rowss, field] = await db.db_connect.execute('UPDATE `sponsor_hospitals` SET location = ?,lat=?,longi=? where hospital_id=' + data.user_id + '', [data.location,data.lat,data.long]);
            if (rows != '') {

                rowsss = rowss;

            }
            
            callback(rowsss);
        } catch (err) {
            throw err;
        }
    }
    async hospital_list_view(data, callback) {
        try {
            const [row] = await db.db_connect.execute('select hospital_login.username,hospital_login.email,hospital_login.otp,sponsor_hospitals.location from hospital_login JOIN sponsor_hospitals ON sponsor_hospitals.hospital_id=hospital_login.id WHERE hospital_login.id=? and hospital_login.is_deleted=?', [data, 0]);
            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async get_policy(data, callback) {
        //let is_deleted=0;
        try {
            //var ql='SELECT policies.*,users.`username` FROM `policies` LEFT JOIN users on policies.sponsorID = users.id'; 
            const [row, field] = await db.db_connect.execute('SELECT * FROM `policies` WHERE `is_deleted` ="0" and  sponsorID=? ORDER BY id DESC',[data]);

            callback(row);
        } catch (err) {
            throw err;
        }
    }

    async save_policy(data, session, callback) {
        try {

            var time = super.time();
            //let rowsss = '';
            let illness_name = new Array();

            if (data.illness_name.length == 1) {
                illness_name.push(data.illness_name);
            } else {
                illness_name = data.illness_name
            }

            const [rows, fields] = await db.db_connect.execute('insert into policies set name=?,number=?,description=?,illness_id=?,expiry_date=?,sponsorID=?', [data.policy_name, data.Policy_number, data.Policy_Details, illness_name, data.expiry_date, session.s_id]);

            callback(rows);
        } catch (err) {
            throw err;
        }

    }
    async policy_edit(data, callback) {
        try {
            const [row] = await db.db_connect.execute('select * from policies  WHERE id=?', [data]);
            console.log(row);return false;
            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async update_policy_details(data, callback) {
        try {

            let illness_name = new Array();

            if (data.illness_name.length == 1) {
                illness_name.push(data.illness_name);
            } else {
                illness_name = data.illness_name
            }
            const [rows, fields] = await db.db_connect.execute('UPDATE `policies` SET name = ?,number=?,description=?,expiry_date=?,illness_id=?,number=? where id=' + data.user_id + '', [data.policy_name, data.Policy_number, data.policy_deatils, data.expiry_date, illness_name, data.Policy_number]);

            callback(rows);
        } catch (err) {
            throw err;
        }
    }
    async policy_list_view(data, callback) {
        try {
            const [rows, fields] = await db.db_connect.execute('select * from policies WHERE id=?', [data]);

            callback(rows);
        } catch (err) {
            throw err;
        }

    }
    async profile_update(data, callback) {
        try {
            const [row] = await db.db_connect.execute('select * from sponser_login  WHERE id=?', [data]);
            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async update_sponsors_details(data, image, callback) {
        try {
            const [r] = await db.db_connect.execute('select * from sponser_login WHERE id=?', [data.user_id]);
            let images = '';
            let rowsss = '';
            if (image != '') {
                images = super.image_Upload(image);
            }

            if (path.extname(images)) {
                images = images;
            } else {
                images = ''
            }

            if (images == '') {
                images = r[0].image;
            }
            const [rows, fields] = await db.db_connect.execute('update sponser_login set username=?,image=?', [data.name, images]);
            if (rows != '') {
                const [rowss] = await db.db_connect.execute('SELECT * from sponser_login WHERE id=?', [data.user_id]);
                if (rowss != '') {
                    rowsss = rowss;
                }
            }
            callback(rowsss);
        } catch (err) {
            throw err;
        }

    }

    async get_dashboard_data(datas) {
        try {
            const[PolicyId]= await db.db_connect.execute('select id from policies where sponsorID=?',[datas]);
            let Hospitals='';
            if(PolicyId!=''){
                const[get_list]= await db.db_connect.execute('SELECT hospital_details.* from hospital_details left join policy_hospital on policy_hospital.hospital_id= hospital_details.id where policy_hospital.policy_id=?',[PolicyId[0].id]);
                Hospitals=get_list ;
            }
            ////Ilness_list count
            const[IlnessId]= await db.db_connect.execute('select id from sponser_login where id=?',[datas]);
            // console.log()
            const[Illness_id]=await db.db_connect.execute('SELECT illnesses.* from illnesses left join sponser_illness on sponser_illness.illness_id = illnesses.id where sponser_illness.sponser_login_id=?',[IlnessId[0].id]);
          
            ////claim_list count

            // const [r] = await db.db_connect.execute("select hospital_details.name,users.username,illnesses.name, cli.id,cli.amount,cli.policy_number,cli.varify_status,cli.redeem_status,cli.no_claim from claim_list_illness as cli LEFT JOIN claim_list ON claim_list.id= cli.claim_request_id left JOIN users ON users.id=claim_list.user_id left join illnesses ON cli.illness_id=illnesses.id LEFT JOIN hospital_details ON claim_list.hospital_id=hospital_details.id where claim_list.sponser_id=?",[datas]);
            const [r]= await db.db_connect.execute("select id from claim_list");
            let data = '';
            data = {
                hospital_list: Hospitals.length,
                illness_list: Illness_id.length,
                claim_list: r.length,
            }
            return data;
        } catch (err) {
            throw err;
        }
    }

    async update_password(data, session, callback) {
        try {

            var time = super.time();
            let hash = super.crypt(data.confirm_passwordd);
            const [rows, fields] = await db.db_connect.execute('update sponser_login set password=?,  modified=? WHERE id = ?', [hash, time, session]);
            callback(rows);
        } catch (err) {
            throw err;
        }
    }


    async check_password(data) {


        try {

            let hash = super.crypt(data.old_passwords);


            const [row] = await db.db_connect.execute('select * from sponser_login where password=? and id=?', [hash, data.id]);

            return row;
        } catch (err) {
            throw err;
        }
    }

    async get_illness() {
        try {
            const [ill_data] = await db.db_connect.execute('SELECT id,name from  illnesses where is_deleted="0"');
            let details = {
                illnesses: ill_data
            }

            return details;
        } catch (err) {
            throw err;
        }
    }

    async get_userdetails(data, callback) {
        try {
            const [user_data] = await db.db_connect.execute('select user_illnesses.id, IFNULL(u.username,"") as u_username,IFNULL(p.name,"") as p_name,illnesses.name as illness_name FROM user_illnesses left JOIN users as u  ON u.id=user_illnesses.user_id left JOIN illnesses ON illnesses.id=user_illnesses.illness_id left JOIN policies as p ON p.id=user_illnesses.id');

            callback(user_data);

        } catch (err) {
            throw err;
        }
    }
    async view_userslist(data, callback) {
        try {
            const [view_data] = await db.db_connect.execute('select user_illnesses.id, IFNULL(u.username,"") as u_username,IFNULL(p.name,"") as p_name,illnesses.name as illness_name FROM user_illnesses left JOIN users as u  ON u.id=user_illnesses.user_id left JOIN illnesses ON illnesses.id=user_illnesses.illness_id left JOIN policies as p ON p.id=user_illnesses.id where user_illnesses.id="' + data + '"');
            callback(view_data);
        } catch (err) {
            throw err;
        }
    }
    async get_illnesses_data_details(data) {

        const [illness_data] = await db.db_connect.execute('select ui.id,IFNULL(u.username,"") as u_username,IFNULL(i.name,"") as illness_name from user_illnesses  as ui left JOIN users as u on u.id=ui.user_id left JOIN illnesses as i on i.id=ui.illness_id WHERE ui.is_deleted="0"');
        return illness_data;

    }
    async get_policy_data_details(data) {

        const [policy_data] = await db.db_connect.execute('select up.id,IFNULL(u.username,"") as u_username,IFNULL(p.name,"") as policy_name, IFNULL(p.policy_number,"") as number from user_policies as up left JOIN users as u on u.id=up.user_id left JOIN policies as p on p.id=up.policy_id where up.is_deleted="0"');
        return policy_data;
    }
    async view_user_illness(data, callback) {
        const [view_illness] = await db.db_connect.execute('select ui.id,IFNULL(u.username,"") as u_username,IFNULL(i.name,"") as illness_name from user_illnesses  as ui left JOIN users as u on u.id=ui.user_id left JOIN illnesses as i on i.id=ui.illness_id WHERE ui.id=?', [data]);
        callback(view_illness);
    }
    async view_user_policy(data, callback) {
        const [view_policy] = await db.db_connect.execute('select up.id,IFNULL(u.username,"") as u_username,IFNULL(p.name,"") as policy_name, IFNULL(p.policy_number,"") as number from user_policies as up left JOIN users as u on u.id=up.user_id left JOIN policies as p on p.id=up.policy_id WHERE  up.id=?', [data]);

        callback(view_policy);
    }

    async maxpolicy(data) {
        try {
            
            const [gethospital] = await db.db_connect.execute('select max(h.policy_to) as max from sponsor_hospitals as sh join hospital_login as h on h.id = sh.hospital_id where sh.is_deleted=? && h.is_deleted=? && sh.sponsorID=?', ['0', '0', data.s_id]);
            
            if (gethospital[0].max != '') {
                return gethospital;
            } else {
                const [getdata] = await db.db_connect.execute('select policy_min,policy_max from policies where is_deleted=? && sponsorID=?', [0, data.s_id]);
                return getdata;
            }

        } catch (err) {
            throw err;
        }
    }

    async illnessNames(data)
    {
        try{
            const[illnessNames] = await db.db_connect.execute('select * from  hospital_login where  id=?',[data]);
            if(illnessNames[0].illnessIds!='')
            {
                let illnessNamesss =  JSON.parse(illnessNames[0].illnessIds);
                /* let daa = [];
                for(let i in illnessNamesss)
                {
                    daa.push(illnessNamesss[i]);
                } */
                console.log('select name from illnesses where id IN('+illnessNamesss+')');
                const[getIllnesses] = await db.db_connect.execute('select name from illnesses where id IN('+illnessNamesss+')');
                return getIllnesses;
            }else{
                return false;
            }
        }catch(err)
        {
            throw err;
        }
    }
 async get_illnesses(data){
   try{
    const[IlnessId]= await db.db_connect.execute('select id from sponser_login where id=?',[data]);
   
   let final_data='';
    if(IlnessId!=''){
        const[Illness_id]=await db.db_connect.execute('SELECT illnesses.* from illnesses left join sponser_illness on sponser_illness.illness_id = illnesses.id where sponser_illness.sponser_login_id=?',[IlnessId[0].id]);
        final_data=Illness_id;
    }
    //console.log(final_data,"====================");return false;
    return final_data;
    
   }catch(err){
       throw err;
   }
 }
async get_list(data){
    try{
        const[PolicyId]= await db.db_connect.execute('select id from policies where sponsorID=?',[data]);
    let final_data='';
    if(PolicyId!=''){
        const[Hospitals]= await db.db_connect.execute('SELECT hospital_details.* from hospital_details left join policy_hospital on policy_hospital.hospital_id= hospital_details.id where policy_hospital.policy_id=?',[PolicyId[0].id]);
        final_data=Hospitals;
    } 
    return final_data;
    }catch(err){
        throw err;
    }
}
}
