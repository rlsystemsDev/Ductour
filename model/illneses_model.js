var Helper = require('../config/helper');
var Database = require('../config/database.js');
var path = require('path');
async = require("async");
var db = '';
var Promise = require('promise');


module.exports = class illneses_model extends Helper {

    constructor() {
        super();
        db = new Database();
    }
    async get_illneses(is_deleted, callback) {
        try {
            const [row, field] = await db.db_connect.execute('SELECT *  FROM `illnesses` where is_deleted=? order by id desc', [0]);
            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async get_illneses_api() {
        try {
            const [row] = await db.db_connect.execute('SELECT *  FROM `illnesses` where is_deleted=? order by id desc', [0]);
            return row;
        } catch (err) {
            throw err;
        }
    }
    async illness_count() {
        try {
            const [Result] = await db.db_connect.execute('select ill_range from illness_range');
            //console.log(Result);
            return Result;
        } catch (error) {
            throw error;
        }
    }

    async insertillness(data) {
        try {
            var time = Date.now();
            var n = time / 1000;
            time = Math.floor(n);
            const [insertillenss] = await db.db_connect.execute('insert into illnesses set name=?,description=?,items=?,status=?,created=?,modified=?,is_deleted=?', [data.illness, data.description,data.items, '1', time, time, 0]);
            return insertillenss;
        } catch (err) {
            throw err;
        }
    }

    async getIllnes(data) {
        try {
            const [getIllness] = await db.db_connect.execute('select * from  illnesses where id=?', [data]);
            return getIllness;
        } catch (err) {
            throw err;
        }
    }

    async updateIll(data) {
        try {
            console.log(data,"============data");
            var time = Date.now();
            var n = time / 1000;
            time = Math.floor(n);
            const [updateIll] = await db.db_connect.execute('update illnesses set name=?,description=?, items=?,modified=? where id=?', [data.illness, data.description,data.items, time, data.id]);
            return updateIll;
        } catch (err) {
            throw err;
        }
    }

    async allIllness() {
        try {
            const [allIllness] = await db.db_connect.execute('select * from illnesses where is_deleted=?', [0]);

            return allIllness;
        } catch (err) {
            throw err;
        }
    }

    async getIllness(data) {
        try {

            const [getIllness] = await db.db_connect.execute('select policy_min,policy_max,illness_id from policies where sponsorID=?', [data.s_id]);
            if (getIllness != '') {
                let illnessId = JSON.parse(getIllness[0].illness_id);

                if (typeof illnessId == 'object') {
                    const [illnessdetailss] = await db.db_connect.execute('select * from illnesses where id IN(' + illnessId + ') && is_deleted="0"');
                    return illnessdetailss;
                } else {
                    const [illnessdetails] = await db.db_connect.execute('select * from illnesses where id=' + illnessId + ' && is_deleted="0"');
                    return illnessdetails;
                }
            }
        } catch (err) {
            throw err;
        }
    }
    async updateStatus(data, callback) {
        try {
            const [row] = await db.db_connect.execute('update illnesses set status=? where id=?', [data.status, data.id]);

            callback(row);
        } catch (e) {
            throw e;
        }
    }
    async GetParticularIllness(UserId) {
        try {
            //const [Details] = await db.db_connect.execute('SELECT illnesses.id,illnesses.name,illnesses.description,claim_list.hospital_id,hospital_details.id,hospital_details.name as hospital_name from  illnesses LEFT JOIN claim_list_illness ON claim_list_illness.illness_id=illnesses.id LEFT JOIN claim_list ON claim_list.id=claim_list_illness.claim_request_id LEFT JOIN hospital_details ON hospital_details.id=claim_list.hospital_id where claim_list.user_id=? group by claim_list.hospital_id ', [UserId]);
            const [Details] = await db.db_connect.execute('SELECT claim_list.hospital_id,hospital_details.name from  illnesses LEFT JOIN claim_list_illness ON claim_list_illness.illness_id=illnesses.id LEFT JOIN claim_list ON claim_list.id=claim_list_illness.claim_request_id LEFT JOIN hospital_details ON hospital_details.id=claim_list.hospital_id where claim_list.user_id=? group by claim_list.hospital_id ', [UserId]);
            //console.log(Details,"=========>Details");return false;
            var response = [];
            for (var i in Details) {

                var [getDetails] = await db.db_connect.execute('SELECT illnesses.id,illnesses.name,illnesses.description from  illnesses LEFT JOIN claim_list_illness ON claim_list_illness.illness_id=illnesses.id LEFT JOIN claim_list ON claim_list.id=claim_list_illness.claim_request_id where claim_list.user_id=? and claim_list.hospital_id=? ', [UserId, Details[i].hospital_id]);

                Details[i].policy_details = getDetails;
                response.push(Details);
            }

            return response;
        } catch (err) {
            throw err;
        }
    }
    async getAllMy(UserId) {
        try {
            
            const [policyDetails] = await db.db_connect.execute('select count(*) as total    from (SELECT *,(SELECT expiry_date FROM `claim_list_illness` WHERE `claim_request_id` = claim_list.id limit 1) as exp FROM `claim_list` WHERE `user_id` = ? HAVING exp >=UNIX_TIMESTAMP())tt', [UserId]);
           
            //    const[allIll]= await db.db_connect.execute('SELECT illnesses.id,illnesses.name,illnesses.description from  illnesses LEFT JOIN claim_list_illness ON claim_list_illness.illness_id=illnesses.id LEFT JOIN claim_list ON claim_list.id=claim_list_illness.claim_request_id where claim_list.user_id=?',[UserId]);
            
            if (policyDetails[0].total == 0) {
                var count = 0
            } else {
                console.log(policyDetails[0].total);
                const [allIll] = await db.db_connect.execute('select ill_range from illness_range ');
                var count = policyDetails[0].total * allIll[0].ill_range;
                // var count=allIll[0].ill_range;
            }

            
            return count
        } catch (err) {
            throw err;
        }
    }
    async getreaminingIll(UserId) {
        try {
            // console.log(UserId,"========UserId");return false;
            /*  const[allIll]= await db.db_connect.execute('SELECT illnesses.id,illnesses.name,illnesses.description from  illnesses LEFT JOIN claim_list_illness ON claim_list_illness.illness_id=illnesses.id LEFT JOIN claim_list ON claim_list.id=claim_list_illness.claim_request_id where claim_list.user_id=? && claim_list_illness.otp=""',[UserId]); */
            // var count=allIll.length
            // return count
            const [OtpAlreadyGen] = await db.db_connect.execute('select count(policy_otp_status.id) as otp_count from policy_otp_status where  user_id=?', [UserId]);
            let final = OtpAlreadyGen[0].otp_count
            console.log(OtpAlreadyGen,"==========OtpAlreadyGen");
            return final;
        } catch (err) {
            throw err;
        }
    }
    async GetleftIllness(UserId) {
        try {

            const [Details] = await db.db_connect.execute('SELECT  claim_list_illness.otp_status,illnesses.id,illnesses.name,illnesses.description from  illnesses LEFT JOIN claim_list_illness ON claim_list_illness.illness_id=illnesses.id LEFT JOIN claim_list ON claim_list.id=claim_list_illness.claim_request_id where claim_list.user_id=?', [UserId]);
            return Details;
        } catch (err) {
            throw err;
        }
    }
    async getallOtp(userid) {
        try {
            console.log(userid);
        } catch (err) {
            throw err;
        }
    }
    async get_items(is_deleted, callback) {
        try {
            const [row, field] = await db.db_connect.execute('SELECT category.name as category_name,item.* FROM `item` left JOIN category  on category.id=item.category_id order by id desc');
           
            callback(row);
        } catch (err) {
            throw err;
        }
    }
    async saveitems(data) {
        try {
            //console.log(data,"==============data");return;
            var time = Date.now();
            var n = time / 1000;
            time = Math.floor(n);
            const [insertillenss] = await db.db_connect.execute('insert into item set name=?,cost=?,status=?,category_id=?,created=?,modified=?', [data.name, data.cost, '1',data.category_id, time, time]);
            return insertillenss;
        } catch (err) {
            throw err;
        }
    }
    async getItem(data) {
        try {
            const [getIllness] = await db.db_connect.execute('select * from  item where id=?', [data]);
            return getIllness;
        } catch (err) {
            throw err;
        }
    }
    async updateItem(data) {
        try {
           
            var time = Date.now();
            var n = time / 1000;
            time = Math.floor(n);
            const [updateIll] = await db.db_connect.execute('update item set name=?,cost=?,category_id=?,modified=? where id=?', [data.name, data.cost,data.category_id, time, data.id]);
            return updateIll;
        } catch (err) {
            throw err;
        }
    }

}