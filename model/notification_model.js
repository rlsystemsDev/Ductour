var Helper = require('../config/helper');
var Database = require('../config/database.js');
var path = require('path');
async = require("async");
var db = '';
var Promise = require('promise');



module.exports = class Notification_model extends Helper {

    constructor() {
        super();
        db = new Database();
    }

    async get_notification(is_deletd) {
        try {
            //var age=super.calculate_age(dob);
            const [rows] = await db.db_connect.execute('SELECT n.id,n.message,u.username as u_username,s.username as s_username,CASE            WHEN a.looking_for = 0 THEN "GP"  WHEN a.looking_for = 1 THEN "specialist" ELSE "theropist"        END as appointment_for FROM notifications as n LEFT JOIN users as u on u.id = n.senderID LEFT JOIN sponser_login as s on s.id = n.receiverID left join appointments as a on a.id = n.appointment_id where n.is_deleted="0" ORDER BY n.id DESC');
            //console.log(rows); return false
            return rows;
        } catch (err) {
            throw err;
        }
    }

    async get_user_notification(user) {
        try {
            //var age=super.calculate_age(dob);
            const [rows] = await db.db_connect.execute('SELECT n.id,n.message,u.username as u_username,s.username as s_username,CASE            WHEN a.looking_for = 0 THEN "GP"  WHEN a.looking_for = 1 THEN "specialist" ELSE "theropist"        END as appointment_for FROM notifications as n LEFT JOIN users as u on u.id = n.senderID LEFT JOIN sponser_login as s on s.id = n.receiverID left join appointments as a on a.id = n.appointment_id where n.is_deleted="0" and n.receiverID=' + user + ' ORDER BY n.id DESC');
            //console.log(rows); return false
            return rows;
        } catch (err) {
            throw err;
        }
    }

    async get_notification_view(data) {
        try {
            const [rows] = await db.db_connect.execute('SELECT n.id,n.message,u.username as u_username,s.username as s_username,CASE            WHEN a.looking_for = 0 THEN "GP"  WHEN a.looking_for = 1 THEN "specialist" ELSE "theropist"        END as appointment_for FROM notifications as n LEFT JOIN users as u on u.id = n.senderID LEFT JOIN sponser_login as s on s.id = n.receiverID left join appointments as a on a.id = n.appointment_id where n.is_deleted="0" && n.id=?', [data]);

            return rows;
        } catch (err) {
            throw err;
        }
    }
    async save_new(data){
        try{
         const[saveData]= await db.db_connect.execute('insert into notify set user_id=?,message=?,description=?',[0,data.title,data.description]);
        console.log(saveData,"=");
        }catch(err){
            throw err;
        }
    }
}