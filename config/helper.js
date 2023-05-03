var Database = require('./database.js');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
async = require("async");
var Validate = require('./validateInput.js');
var connect = '';
const nodemailer = require('nodemailer');
var md5 = require('md5');
var FCM = require('fcm-node');
module.exports = class Helper extends Validate {
	constructor() {
		super();
		this.db = new Database();
		connect = this.db;
		this.data = false;

	}
	crypt(password) {
		const hash = crypto.createHmac('md5', password)
			.update('')
			.digest('hex');
		return hash;
	}
	cryptHashPass(password){
		const hash= md5(password);
		return hash
	}

	image_Upload(image) {
		if (image) {
			var extension = path.extname(image.file.name);
			var filename = uuid() + extension;
			var sampleFile = image.file;


			sampleFile.mv(process.cwd() + '/public/images/users/' + filename, (err) => {
				if (err) throw err;
			});

			return filename;
		}
	}


	new_image_Upload(image) {
		if (image) {
			var extension = path.extname(image.name);
			var filename = uuid() + extension;
			var sampleFile = image;
			

			sampleFile.mv(process.cwd() + '/public/images/users/' + filename, (err) => {
				if (err) throw err;
			});

			return filename;
		}
	}
	image_Uploads(image, already_files) { //file upload
		try {
			if (image) {
				var oldPath = image.image.path;
				var extension = path.extname(image.image.originalFilename);
				var filename = uuid() + extension;
				var newPath = process.cwd() + '/public/images/users/' + filename;
				fs.rename(oldPath, newPath, function (err) {

					if (err) throw err;
					if (already_files != '') {
						console.log(already_files);
						fs.unlink(process.cwd() + '/public/images/users/' + already_files);
					}
				});
				return filename;
			}
		} catch (err) {
			throw err;
		}
	}


	create_auth() {
		try {
			let current_date = (new Date()).valueOf().toString();
			let random = Math.random().toString();
			return crypto.createHash('sha1').update(current_date + random).digest('hex');
		} catch (err) {
			throw err;
		}
	}

	async check_auths(data, callback) {
		try {
			// console.log(data);return false;
			let rows = '';
			const [row, field] = await connect.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and authorization_key=? and security_key=?', ['0', data.auth_key, data.security_key]);
			if (row) {
				rows = row;
			}
			callback(rows);
		} catch (err) {
			throw err;
		}
	}

    /* send_email	 (hash_key, user_data, callback)
    {
    	try{
    					// console.log(hash_key);
    					// console.log(user_data);return false;
    					var transporter = nodemailer.createTransport({
							service: 'gmail',
							auth: {
								user: 'lallan.apptunix@gmail.com',
								pass: 'lallan123'
							}
						});
						var mailOptions = {
							from: 'lallan.apptunix@gmail.com',
							to: user_data.email,
							subject: 'Hair Brain: Forgot password',
							html: 'Click here for change password <a href="http://localhost:5000/api/url/'+hash_key+'"> Click</a>'
							
						};

						transporter.sendMail(mailOptions, function(error, info){
							if (error) {
								console.log(error);
							} else {
								console.log('email sent');
								res.send('Email send');
							}
						});
						callback('Email sent');
    	}catch(err){
    		throw err;
    	}
    }
 */
	send_emails(user_email, name, password) {
		try {
			console.log(user_email, 'user in sponsers');
			/* console.log(data,'data');
			 console.log(data[0].email,'email');return false; */

			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'ductourapps@gmail.com',
					pass: 'ductour2020'
				}
			});
			var mailOptions = {
				from: 'ductourapps@gmail.com',
				to: user_email,
				//body: password,
				subject: 'Ductour App: Admin Sign Up Confirmation',
				html: '<center><img src="http://3.13.214.27/doctourapp/public/images/logo_set.png"><p>Congratulations <b>' + name + '</b><p><br><p>You Have Successfully Registered As A <b>Sponsor</b> On DuctourApp<p><br><p>Below is Your Login Credential To View Activities On Your Account </p><br><p>Email:<b>' + user_email + '</b><p>Password:<b>' + password + '</b></p><br>Click here for Login  <a href="https://admin.ductour.com/sponsors"> Click</a><br><p>Thank You for Your Support</b></p></center>'

			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('email sent');
					res.send('Email send');
				}
			});
		} catch (err) {
			throw err;
		}
	}
	send_hmo_emails(user_email, name, password) {
		try {
			console.log(user_email, 'user in sponsers');
			/* console.log(data,'data');
			 console.log(data[0].email,'email');return false; */

			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'ductourapps@gmail.com',
					pass: 'ductour2020'
				}
			});
			var mailOptions = {
				from: 'ductourapps@gmail.com',
				to: user_email,
				//body: password,
				subject: 'Ductour App: Admin Sign Up Confirmation',
				html: '<center><img src="http://3.13.214.27/doctourapp/public/images/logo_set.png"><p>Congratulations <b>' + name + '</b><p><br><p>You Have Successfully Registered As A <b>Agent</b> On DuctourApp<p><br><p>Below is Your Login Credential To View Activities On Your Account </p><br><p>Email:<b>' + user_email + '</b><p>Password:<b>' + password + '</b></p><br>Click here for Login  <a href="https://admin.ductour.com/hmo"> Click</a><br><p>Thank You for Your Support</b></p></center>'

			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('email sent');
					res.send('Email send');
				}
			});
		} catch (err) {
			throw err;
		}
	}
	send_emailss(user_email, name, password) {
		try {
			//console.log(user_email, 'user in hospital');
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'ductourapps@gmail.com',
					pass: 'ductour2020'
				}
			});
			var mailOptions = {
				from: 'ductourapps@gmail.com',
				to: user_email,
				//body: password,
				subject: 'Ductour App: Admin Sign Up Confirmation',
				html: '<center><img src="http://3.13.214.27/doctourapp/public/images/logo_set.png"><p>Congratulations <b>' + name + '</b><p><br><p>You Have Successfully Registered As A <b>Hospital</b> On DuctourApp<p><br><p>Below is Your Login Credential To View Activities On Your Account </p><br><p>Email:<b>' + user_email + '</b><p>Password:<b>' + password + '</b></p><br>Click here for Login  <a href="https://admin.ductour.com/hospitaldash"> Click</a><br><p>Thank You for Your Support</b></p></center>'

			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('email sent');
					res.send('Email send');
				}
			});
		} catch (err) {
			throw err;
		}
	}
	send_rest_email(user_email, name, password) {
		try {
			//console.log(user_email, 'user in hospital');
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'ductourapps@gmail.com',
					pass: 'ductour2020'
				}
			});
			var mailOptions = {
				from: 'ductourapps@gmail.com',
				to: user_email,
				//body: password,
				subject: 'Ductour App: Admin Sign Up Confirmation',
				html: '<center><img src="http://3.13.214.27/doctourapp/public/images/logo_set.png"><p>Congratulations <b>' + name + '</b><p><br><p>You Have Successfully Registered As A <b>Restaurant</b> On DuctourApp<p><br><p>Below is Your Login Credential To View Activities On Your Account </p><br><p>Email:<b>' + user_email + '</b><p>Password:<b>' + password + '</b></p><br>Click here for Login  <a href="https://admin.ductour.com/restaurants"> Click</a><br><p>Thank You for Your Support</b></p></center>'

			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('email sent');
					res.send('Email send');
				}
			});
		} catch (err) {
			throw err;
		}
	}
	send_claim_notification(user_email, name, password) {
		try {

			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'ductourapps@gmail.com',
					pass: 'ductour2020'
				}
			});
			var mailOptions = {
				from: 'ductourapps@gmail.com',
				to: user_email,
				//body: password,
				subject: 'Ductour App: Admin Sign Up Confirmation',
				html: '<center><img src="http://3.13.214.27/doctourapp/public/images/logo_set.png"> <p>Congratulations <b>' + name + '</b><p><br><p>ou Have Successfully Registered As A <b>Hospital</b> On DuctourApp<p><br><p>Below is Your Login Credential To View Activities On Your Account </p><br><p>Email:<b>' + user_email + '</b><p>Password:<b>' + password + '</b></p><p>Thank You for Your Support<b>DuctourApp</b></p></center>'

			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('email sent');
					res.send('Email send');
				}
			});
		} catch (err) {
			throw err;
		}
	}

	time() {
		var time = Date.now();
		var n = time / 1000;
		return time = Math.floor(n);
	}
	send_notification(notification_data) {
		try {
			var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
			var fcm = new FCM(serverKey);

			var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
				to: notification_data.device_token,
				//collapse_key: 'your_collapse_key',

				/* notification: {
					body: notification_data.body.Hospitals[0] 
				}, */

				data: {  //you can send only notification or only data(or include both)
					title: 'Ductour Feedback Massage',
					message: notification_data.message,
					notification_code: notification_data.notification_code,
					body: notification_data.body
				}


				/* data: {  //you can send only notification or only data(or include both)
					...notification_data.body
				} */
			};
			//console.log(message,'message');
			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		} catch (err) {
			throw err;
		}
	}
	send_renew_notification(notification_data) {
		try {
			/* console.log(notification_data,'ger');return false; */

			var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
			var fcm = new FCM(serverKey);

			var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
				to: notification_data.device_token,
				//collapse_key: 'your_collapse_key',

				/* notification: {
					body: notification_data.body.Hospitals[0] 
				}, */

				data: {  //you can send only notification or only data(or include both)
					title: 'Ductour Renew Massage',
					message: notification_data.message,
					notification_code: notification_data.notification_code,
					//body:notification_data.body
				}


				/* data: {  //you can send only notification or only data(or include both)
					...notification_data.body
				} */
			};
			//console.log(message, 'message');
			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		} catch (err) {
			throw err;
		}
	}
	async sendIllnessNotification(illData) {
		//const [row, field] = await connect.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and device_token !="" ', ['0']);
		const [row, field] = await connect.db_connect.execute('SELECT id,device_type,device_token FROM `users` WHERE `is_deleted` = ? and device_token !="" order by id desc limit 10', ['0']);

		for (var i in row) {
		if(row[i].device_type ==1){
		var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		var fcm = new FCM(serverKey);
	

			var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
				to: row[i].device_token,
				//collapse_key: 'your_collapse_key',

				/* notification: {
					body: notification_data.body.Hospitals[0] 
				}, */

				data: {  //you can send only notification or only data(or include both)
					title: illData.illness,
					message: illData.description,
					notification_code: 5,
					//body:notification_data.body
				}
				/* data: {  //you can send only notification or only data(or include both)
					...notification_data.body
				} */
			};
			var messsgaeIll = " New Treatment Added: "  +  illData.illness ;
			await connect.db_connect.execute('Insert into notify set user_id=?,message=?,description=?', [row[i].id, messsgaeIll,illData.description]);

			//console.log(message, 'message');
			fcm.send(message, function (err, response) {
				if (err) {
					//console.log("Something has gone wrong!", err);
				} else {
					//console.log("Successfully sent with response: ", response);
				}
			});
		}else if(row[i].device_type ==2){
			var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		var fcm = new FCM(serverKey);
	

			var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
				to: row[i].device_token,
				//collapse_key: 'your_collapse_key',

				/* notification: {
					body: notification_data.body.Hospitals[0] 
				}, */

				data: {  //you can send only notification or only data(or include both)
					title: illData.illness,
					message: illData.description,
					notification_code: 5,
					//body:notification_data.body
				}
				/* data: {  //you can send only notification or only data(or include both)
					...notification_data.body
				} */
			};
			var messsgaeIll = " New Treatment Added: "  +  illData.illness ;
			await connect.db_connect.execute('Insert into notify set user_id=?,message=?,description=?', [row[i].id, messsgaeIll,illData.description]);

			//console.log(message, 'message');return false;
			fcm.send(message, function (err, response) {
				if (err) {
					//console.log("Something has gone wrong!", err);
				} else {
					//console.log("Successfully sent with response: ", response);
				}
			});	
		}
		}
	}
	async sendHealthTipNotification(tipData) {
		const [row, field] = await connect.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and device_token !="" ', ['0']);
		//const [row, field] = await connect.db_connect.execute('SELECT id,device_type,device_token FROM `users` WHERE `is_deleted` = ? and device_token !="" order by id desc limit 10', ['0']);
		//console.log(row,"============");return false;
		for (var i in row) {
		if(row[i].device_type ==1){
		var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		var fcm = new FCM(serverKey);
		
			var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
				to: row[i].device_token,
				//collapse_key: 'your_collapse_key',

				/* notification: {
					body: notification_data.body.Hospitals[0] 
				}, */

				data: {  //you can send only notification or only data(or include both)
					title: tipData.title,
					message:tipData.description ,
					notification_code: 6,
					//body:notification_data.body
				}
				/* data: {  //you can send only notification or only data(or include both)
					...notification_data.body
				} */
			};

			var messsgaeIll = "New Health Tip Added: " +tipData.title ;
			await connect.db_connect.execute('Insert into notify set user_id=?,message=?,description=?', [row[i].id, messsgaeIll,tipData.description]);

			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		}else if(row[i].device_type ==2){
			var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		   var fcm = new FCM(serverKey);
		
			var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
				to: row[i].device_token,
				notification: {
					title: tipData.title,
					message: tipData.description,
					notification_code: 6,
				},

				data: {  //you can send only notification or only data(or include both)
					title: tipData.title,
					message:tipData.description ,
					notification_code: 6,
					//body:notification_data.body
				}
				/* data: {  //you can send only notification or only data(or include both)
					...notification_data.body
				} */
			};

			var messsgaeIll = "New Health Tip Added: " +tipData.title ;
			await connect.db_connect.execute('Insert into notify set user_id=?,message=?,description=?', [row[i].id, messsgaeIll,tipData.description]);

			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		}
		}
	}
	
	async sendHealthGameNotification(gameData) {
		const [row, field] = await connect.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and device_token !="" ', ['0']);
		//const [row, field] = await connect.db_connect.execute('SELECT id,device_type,device_token FROM `users` WHERE `is_deleted` = ? and device_token !="" order by id desc limit 10', ['0']);
		for (var i in row) {
		 if(row[i].device_type ==1){
		var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		var fcm = new FCM(serverKey);
		
			var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
				to: row[i].device_token,
				//collapse_key: 'your_collapse_key',

				/* notification: {
					body: notification_data.body.Hospitals[0] 
				}, */

				data: {  //you can send only notification or only data(or include both)
					title: gameData.name,
					message:gameData.description,
					notification_code: 8,
					//body:notification_data.body
				}
				/* data: {  //you can send only notification or only data(or include both)
					...notification_data.body
				} */
			};

			var messsgaeIll =  " New Health Game Added: " + gameData.name ;
			await connect.db_connect.execute('Insert into notify set user_id=?,message=?,description=?', [row[i].id, messsgaeIll,gameData.description]);

			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		}else if(row[i].device_type ==2){
			var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		var fcm = new FCM(serverKey);
		
			var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
				to: row[i].device_token,
				notification: {
					title: gameData.name,
					message: gameData.description,
					notification_code: 8,
				},

				data: {  //you can send only notification or only data(or include both)
					title: gameData.name,
					message:gameData.description,
					notification_code: 8,
					//body:[]
				}
				/* data: {  //you can send only notification or only data(or include both)
					...notification_data.body
				} */
			};

			var messsgaeIll =  " New Health Game Added: " + gameData.name ;
			await connect.db_connect.execute('Insert into notify set user_id=?,message=?,description=?', [row[i].id, messsgaeIll,gameData.description]);

			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		}
	}
	}
	async sendHospitalNotification(hospData) {
		const [row, field] = await connect.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and device_token !="" ', ['0']);
		//const [row, field] = await connect.db_connect.execute('SELECT id,device_type,device_token FROM `users` WHERE `is_deleted` = ? and device_token !="" order by id desc limit 10', ['0']);
		console.log(row,"=====================/hospitals/add");//return false;
		for (var i in row) {
		if(row[i].device_type==1){
		var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		var fcm = new FCM(serverKey);
		
			var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
				to: row[i].device_token,
				// notification: {
				// 	title: hospData.hospital_name,
				// 	message: hospData.addreess,
				// 	notification_code: 9,
				// },

				data: {  //you can send only notification or only data(or include both)
					title: hospData.hospital_name,
					message: hospData.addreess,
					notification_code: 9,
					//body:[]
				}
				/* data: {  //you can send only notification or only data(or include both)
					...notification_data.body
				} */
			};

			var messsgaeIll =  " New Hospital Added: "   +   hospData.hospital_name;
			await connect.db_connect.execute('Insert into notify set user_id=?,message=?,description=?', [row[i].id, messsgaeIll,hospData.addreess]);

			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		}else if(row[i].device_type==2){
			console.log("in devie 2");
			var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		var fcm = new FCM(serverKey);
		
			var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
				to: row[i].device_token,
				notification: {
					title: hospData.hospital_name,
					message: hospData.addreess,
					notification_code: 9,
				},

				contnetType:1,sound:"default",
				body: {  //you can send only notification or only data(or include both)
					title: hospData.hospital_name,
					message: hospData.addreess,
					notification_code: 9,
					//body:[]
					//body:notification_data.body
				}
				
			};

			var messsgaeIll =  " New Hospital Added: "   +   hospData.hospital_name;
			await connect.db_connect.execute('Insert into notify set user_id=?,message=?,description=?', [row[i].id, messsgaeIll,hospData.addreess]);

			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		}
	}
	}
	send_otp_notification(notification_data) {
		try {
			var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
			var fcm = new FCM(serverKey);

			var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
				to: notification_data.device_token,
				//collapse_key: 'your_collapse_key',

				/* notification: {
					body: notification_data.body.Hospitals[0] 
				}, */

				data: {  //you can send only notification or only data(or include both)
					title: 'Ductour SignUp Varification Otp',
					message: notification_data.message,
					notification_code: notification_data.notification_code,
					body: notification_data.body
				}


				/* data: {  //you can send only notification or only data(or include both)
					...notification_data.body
				} */
			};
			console.log(message,'message');
			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		} catch (err) {
			throw err;
		}
	}
	async sendAdmin(notifData) {
		const [row, field] = await connect.db_connect.execute('SELECT id,device_type,device_token FROM `users` WHERE `is_deleted` = ? and device_token !=""', ['0']);
		//const [row, field] = await connect.db_connect.execute('SELECT id,device_type,device_token FROM `users` WHERE `is_deleted` = ? and device_token !="" order by id desc limit 5', ['0']);
		

		// var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		 //var fcm = new FCM(serverKey);
		for (var i in row) {
		if(row[i].device_type ==1){
		 var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		var fcm = new FCM(serverKey);
		
	
			var message = { 
				to: row[i].device_token,
			
				data: {  //you can send only notification or only data(or include both)
					title: notifData.title,
					message: notifData.description,
					notification_code: 7,
					//body:notification_data.body
				}
			};
			
			var title = notifData.title ;
			await connect.db_connect.execute('Insert into notify set user_id=?,message=?,description=?', [row[i].id, title,notifData.description]);
			
			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		}else if(row[i].device_type==2){
			var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		var fcm = new FCM(serverKey);
		
			var message = { 
			
				///
				to:row[i].device_token,
				notification: {
					title: notifData.title,
					message: notifData.description,
					notification_code: 7,
				},
				
				contnetType:1,sound:"default",
				body: {  
					title: notifData.title,
					message: notifData.description,
					notification_code: 7,
					// body:[]
				}
			};
			//console.log(message,"================message");
			var title = notifData.title ;
			await connect.db_connect.execute('Insert into notify set user_id=?,message=?,description=?', [row[i].id, title,notifData.description]);

          //  console.log(row[i].device_token,"=======================row[i].device_token");
			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		}
		
		}
	}
	send_email(hash_key, user_data) {
		try {
			var transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: 'ductourapps@gmail.com',
					pass: 'ductour2020'
				}
			});
			var mailOptions = {
				from: 'ductourapps@gmail.com',
				to: user_data,
				subject: 'Ductour : Forgot password Assistance',
				html:'Click here for Reset Your password <a href="https://admin.ductour.com/api/forget_password/' + hash_key + '">Click</a>'
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('email sent');
					res.send('Email send');
				}
			});
			return ('Email sent');
		} catch (err) {
			throw err;
		}
	}
	async send_mealcode_notification(notifData,userid,addedTime) {
		console.log(notifData.device_type ,"=================send_mealcode_notification");
		if(notifData.device_type ==1){
		 var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		var fcm = new FCM(serverKey);
		
	
			var message = { 
				to: notifData.device_token,
			
				data: {  //you can send only notification or only data(or include both)
					title: notifData.title,
					message: notifData.message,
					notification_code: notifData.notification_code,
					//body:notification_data.body
				}
			};
			
			var title = notifData.title ;
			await connect.db_connect.execute('Insert into notify set user_id=?,message=?,description=?', [userid,title,"Meal Code"]);
			
			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		}else if(notifData.device_type==2){
			var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		var fcm = new FCM(serverKey);
		
			var message = { 
			
				///
				to:notifData.device_token,
				notification: {
					title: notifData.title,
					message: notifData.message,
					notification_code: notifData.notification_code,
				},
				
				contnetType:1,sound:"default",
				body: {  
					title: notifData.title,
					message: notifData.message,
					notification_code: notifData.notification_code,
					// body:[]
				}
			};
			//console.log(message,"================message");
			var title = notifData.title ;
			let currenttime= Math.round(new Date().getTime()/1000);
			let exatctime= currenttime+(addedTime);
			console.log(currenttime,"===========currenttime");
			console.log(addedTime,"=========addedTime");
			console.log(exatctime,"==============exatctime");
			
			await connect.db_connect.execute('Insert into notify set user_id=?,message=?,description=?,timing=?', [userid,title,"Meal Code",exatctime]);

        
			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		}
	}
	async send_otpverfivation_notification(notifData,userid,addedTime) {
		console.log(notifData ,"=================send_mealcode_notification");
		if(notifData.device_type ==1){
		 var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		var fcm = new FCM(serverKey);
		
	
			var message = { 
				to: notifData.device_token,
			
				data: {  //you can send only notification or only data(or include both)
					title: notifData.title,
					message: notifData.message,
					notification_code: notifData.notification_code,
					body:notifData.body
				}
			};
			var title = notifData.title ;
			console.log('Insert into notify set user_id=?,message=?,description=?', [userid, title,title]);
			await connect.db_connect.execute('Insert into notify set user_id=?,message=?,description=?', [userid,title,"Verification Code"]);
			
			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		}else if(notifData.device_type==2){
			var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
		var fcm = new FCM(serverKey);
		
			var message = { 
			
				///
				to:notifData.device_token,
				notification: {
					title: notifData.title,
					message: notifData.message,
					notification_code: notifData.notification_code,
				},
				contnetType:1,sound:"default",
				body: {  
					title: notifData.title,
					message: notifData.message,
					notification_code: notifData.notification_code,
					// body:[]
				}
			};
			let currenttime= Math.round(new Date().getTime()/1000);
			let exatctime= currenttime+(addedTime);
			console.log(currenttime,"===========currenttime");
			console.log(addedTime,"=========addedTime");
			console.log(exatctime,"==============exatctime");

			var title = notifData.title ;
			await connect.db_connect.execute('Insert into notify set user_id=?,message=?,description=?,timing=?', [userid,title,"Verification Code",exatctime]);

        
			fcm.send(message, function (err, response) {
				if (err) {
					console.log("Something has gone wrong!", err);
				} else {
					console.log("Successfully sent with response: ", response);
				}
			});
		}
		
		
	}
};