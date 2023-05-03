var  Database = require('./database.js');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var uuid = require('uuid');
async = require("async");
var  Validate = require('./validateInput.js');
var connect='';
const nodemailer = require('nodemailer');
module.exports = class Helper extends Validate{
	constructor(){
		super();
		this.db = new Database();
		connect=this.db;
		this.data=false;
		
	 }
	 
	 crypt(password){
		 const hash = crypto.createHmac('md5', password)
                                        .update('')
                                        .digest('hex');
		return hash;
	 }

	image_Upload (image) {
		if(image)	{
			
			var extension = path.extname(image.file.name); 
			var filename =  uuid()+extension;
			var sampleFile = image.file;
			

			 sampleFile.mv(process.cwd()+'/public/images/users/' + filename,(err)=>{
				if(err)throw err;
				console.log(filename);
				
			 });
			
				return filename;
	    }
	}

	image_Uploads (image,already_files) { //file upload
		try{
			if(image)	{
				var oldPath = image.image.path;
				var extension = path.extname(image.image.originalFilename); 
		        var filename =  uuid()+extension;
		        var newPath = process.cwd()+'/public/images/users/' + filename;
		    		fs.rename(oldPath, newPath, function (err) {	
		        
						if (err) throw err;	
						if(already_files !=''){
							console.log(already_files);
							fs.unlink(process.cwd()+'/public/images/users/' + already_files);
						}
					});
					return filename;
		    }
		}catch(err){
			throw err;
		}
	}


	create_auth ()
	{
		try{
			let current_date = (new Date()).valueOf().toString();
			let random = Math.random().toString();
			return crypto.createHash('sha1').update(current_date + random).digest('hex');
		}catch(err){
			throw err;
		}
	}

	async check_auths (data, callback)
    {
        try{
        	// console.log(data);return false;
            let rows = '';
            const [row, field] = await connect.db_connect.execute('SELECT * FROM `users` WHERE `is_deleted` = ? and authorization_key=? and security_key=?', ['0',data.auth_key,data.security_key]);
            if(row){
                rows = row;   
            }
            callback(rows);
        }catch(err){
            throw err;
        }
    }

    send_email	 (hash_key, user_data, callback)
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
							html: 'Click here for change password <a href="http://202.164.42.227:3002/api/url/'+hash_key+'"> Click</a>'
							
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

    send_emails	 (hash_key, user_data, callback)
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
							html: 'Click here for change password <a href="http://202.164.42.227:3002/apis/url/'+hash_key+'"> Click</a>'
							
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
	
	time ()
	{
		var time = Date.now(); 
		var n = time/1000;
		return time = Math.floor(n); 
	}
	 
};