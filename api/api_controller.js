var Database = require('../config/database.js');
const Helper = require('../config/helper');
const Users = require('../model/users_model');
const Hospitals = require('../model/hopsital_login_model');
const Illneses = require('../model/illneses_model');
const Claimlist = require('../model/sponsers/claimlist_model');
const Healthtips = require('../model/healthtips_model');
const Sponsers = require('../model/sponsers_model');
const Faq = require('../model/faq_model');
const Notification = require('../model/notification_model');
const Contents = require('../model/contents_model');
const axios = require('axios');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//const credentials = new Buffer('Roducate01:ugrHQi2mZBp7qz4').toString('base64');
const credentials = new Buffer('randjltd:@Fr743@J2!#').toString('base64');
var FCM = require('fcm-node');
console.log(credentials, "=================>");
var helpers = '';
var users = '';
var hospitals = '';
var illneses = '';
var claimlist = '';
var healthtips = '';
var sponsers = '';
var faq = '';
var db = '';
var notifications = '';
var contents = '';
var path = require('path');
module.exports = class Api_controller {

	constructor() {
		db = new Database();
		helpers = new Helper;
		users = new Users();
		notifications = new Notification();
		hospitals = new Hospitals();
		illneses = new Illneses();
		claimlist = new Claimlist();
		healthtips = new Healthtips();
		sponsers = new Sponsers();
		faq = new Faq();
		contents = new Contents();
	}
	async signup(req, res) {
		try {
			req.check('login_type', 'login_type field is required').notEmpty();
			if (req.body.login_type == 1) {
				req.check('security_key', 'security_key field is required').notEmpty()
				//req.check('phone', 'phone field is required').notEmpty();
				//req.check('country_code', 'country_code field is required').notEmpty();		
				req.check('dob', 'dob field is required').notEmpty();
				req.check('gender', 'gender field is required').notEmpty();
				req.check('username', 'username field is required').notEmpty();
				//req.check('device_type', 'device_type field is required').notEmpty();
				//req.check('device_token', 'device_token field is required').notEmpty();
				req.check('social_id', 'social_id field is required').notEmpty();
				req.check('seconds', 'seconds field is required').notEmpty();
			} else {
				req.check('security_key', 'security_key field is required').notEmpty()
				req.check('phone', 'phone field is required').notEmpty();
				req.check('country_code', 'country_code field is required').notEmpty();
				req.check('dob', 'dob field is required').notEmpty();
				req.check('gender', 'gender field is required').notEmpty();
				req.check('username', 'username field is required').notEmpty();
				req.check('country_name', 'country_name field is required').notEmpty();
				//req.check('device_token', 'device_token field is required').notEmpty();
				req.check('seconds', 'seconds field is required').notEmpty();
			}
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {

				let SaveDetails = await users.add_user(req.body, req.headers);
				console.log(SaveDetails, "==================SaveDetailsSaveDetails");
				if (SaveDetails != '') {
					var datas = {
						status: 'success',
						successCode: 200,
						message: ' You are Successfully Registered',
						body: SaveDetails[0]

					}
					res.status(200).send(datas);

				}
				/* else{
							var datas = {
								status: 'success',
								successCode: 200,
								message: ' You are Successfully Registered',
								body:SaveDetails

							}
							res.status(200).send(datas);
							} */
			}



		} catch (error) {
			throw error
		}
	}
	async login(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('password', 'password field is required').notEmpty();
			req.check('username', 'username field is required').notEmpty();
			req.check('seconds', 'seconds field is required').notEmpty();
			//req.check('device_type', 'device_type field is required').notEmpty();
			//req.check('device_token', 'device_token field is required').notEmpty();
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}

			} else {


				//console.log(req.headers.device_token == undefined);
				if (req.headers.device_token == undefined) {
					req.headers.device_token = '';
				}
				if (req.headers.device_type == undefined) {
					req.headers.device_type = '';
				}
					console.log(req.headers.device_token, "=======");
				let checkeDetails = await users.check_exist_details(req.body, req.headers);

				console.log(checkeDetails,"================ddd")


				if (checkeDetails.length > 0) {
					if (checkeDetails[0].member_type == 1 || checkeDetails[0].member_type == 0 || checkeDetails[0].member_type == 3) {
						var dob_entry = checkeDetails[0].dob;
						var split_dob = dob_entry.split("/");
						var day = split_dob[0];
						var month = split_dob[1];
						var year = split_dob[2];

						var dob_asdate = new Date(year, month, day);
						var today = new Date();
						var mili_dif = Math.abs(today.getTime() - dob_asdate.getTime());
						var age = Math.round(mili_dif / (1000 * 3600 * 24 * 365.25));

						if (checkeDetails[0].member_type == 3) {
							if (age < 18) {
								var datas = {
									status: 'error',
									successCode: 400,
									message: 'Below 18 years user cannot able to login',
									body: {}

								}
								res.status(400).send(datas);
							}
						}
						console.log(req.body.device_token)
						let updateValue = await users.update_auths(checkeDetails, req.headers, req.body);
						//res.status(400).send(updateValue);

						//get the previous latest claim..

						//	if(checkeDetails[0].member_type==1){

						let getclaim = await db.db_connect.execute('select id from claim_list where user_id=? order by id desc limit 1', [updateValue[0].id]);

						let policyNumber = '';
						let claim_request_id = 0
						if (getclaim[0].length > 0) {
							let getducid = await db.db_connect.execute('select id,claim_request_id,policy_number from claim_list_illness where claim_request_id=?', [getclaim[0][0].id]);
							policyNumber = getducid[0][0].policy_number
							claim_request_id = getducid[0][0].claim_request_id

						}
						if (updateValue != '') {
							var datas = {
								status: 'success',
								successCode: 200,
								PolicyNumber: policyNumber,
								claimId: claim_request_id,
								message: 'Login Successful',

								body: updateValue[0]

							}
							res.status(200).send(datas);
						}

					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: 'Only App & Child user can Login ',
							body: {}

						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 400,
						message: 'Invalid Login Credentials',
						body: {}

					}
					res.status(400).send(datas);
				}

			}
		} catch (e) {
			throw e;
		}
	}
	async logout(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();

			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let validAuth = await users.check_auths(req.headers.auth_key);
				if (validAuth != '') {
					let Details = users.got_logout(req.headers.auth_key);
					if (Details != '') {
						var datas = {
							status: 'success',
							successCode: 200,
							message: 'Logout Successful',
							body: {}

						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: 'Error While Logout',
							body: {}

						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavlid Authorization Key or Authorization Key Empty',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (error) {
			throw error;
		}
	}
	async social_login(req, res) {
		try {
			//console.log(req.body,req.headers);return false;
			let Check_existing = await users.check_social_details(req.body, req.headers);
			console
			if (Check_existing == '') {
				let InsertNew = await users.new_Social_login(req.body, req.headers);
				if (InsertNew != '') {
					var datas = {
						status: 'success',
						successCode: 200,
						sociallogin: 1,
						message: 'Social Login Successful',
						body: InsertNew[0]

					}
					res.status(200).send(datas);
				}
			} else {
				let updateValue = await users.update_Social_login(Check_existing, req.body);

				var datas = {
					status: 'success',
					successCode: 200,
					sociallogin: 2,
					message: 'Social Login Successful',
					body: updateValue[0]

				}
				res.status(200).send(datas);
			}
		} catch (err) {
			throw err;
		}
	}
	async hospital_listing(req, res) {
		try {

			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();
			req.check('lat', 'lat field is required').notEmpty()
			req.check('long', 'long field is required').notEmpty();

			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let validAuth = await users.check_auths(req.headers.auth_key);

				if (validAuth != '') {
					let getPayment = await users.get_set_payment();

					let Hospitals = await hospitals.get_hospital_list(req.body.illness_ids, req.body.lat, req.body.long);
					//console.log(Hospitals,"=========Hospitals");return;
					if (Hospitals != '') {
						var datas = {
							status: 'success',
							successCode: 200,
							topt_up_amount: getPayment[0].top_up_amount,
							renew_amount: getPayment[0].renew_amount,
							comment: getPayment[0].comment,
							message: 'Hospital List',
							body: Hospitals
						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							topt_up_amount: 0,
							renew_amount: 0,
							message: 'No Hospital Found',
							body: {}
						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavlid Authorization Key or Authorization Key Empty',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async illness_listing(req, res) {
		try {

			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();

			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				//res.send(req.body);
				let final_user = '';
				if (!req.body.child_id || req.body.child_id && req.body.child_id == '') {
					let validAuth = await users.check_auths(req.headers.auth_key);

					final_user = validAuth[0].id
				} else {
					let validAuth = await users.check_child_auths(req.body.child_id);
					//console.log(validAuth, "in else");
					final_user = validAuth[0].id
				}
				//console.log(final_user, "============>finaluser");
				//let validAuth=  await users.check_auths(req.headers.auth_key);
				if (final_user != '') {
					let claim_id = await claimlist.get_unique_claimId(final_user);
					let final_data = '';
					if (claim_id == '') {
						final_data = 0
					} else {
						final_data = claim_id[0].id
					}

					let is_expire = await claimlist.get_policy_status(final_user);
					let UsersIllness = await claimlist.get_Users_illneses(final_user);
					let Illness = await illneses.get_illneses_api();
					let maxIllness = await illneses.illness_count();
					let otp_count = await claimlist.get_otpCount(final_data)
					let payStatus = await claimlist.payemnt_status(final_data);
					let AllIllness = await claimlist.getIllness_Count(final_user)
					let RemainingIllness = await illneses.getreaminingIll(final_user);
					let totalmeal = AllIllness / 4;
					if (Illness != '' && UsersIllness != '') {
						var datas = {
							status: 'success',
							otpCount: otp_count,
							Policy_Expire: is_expire,
							count: maxIllness[0].ill_range,
							ClaimId: final_data,
							Payment: payStatus,
							allIllnessCount: AllIllness,
							AlreadyUsedIllness: RemainingIllness,
							totalmeal: totalmeal,
							successCode: 200,
							message: 'Illness  List',
							body: {
								selectdIllness: UsersIllness[0],
								allIllness: Illness,
							}

						}
						res.status(200).send(datas);
						//}
					} else {
						var datas = {
							status: 'suceess',
							otpCount: 0,
							Policy_Expire: 0,
							count: maxIllness[0].ill_range,
							ClaimId: 0,
							Payment: 0,
							allIllnessCount: 0,
							AlreadyUsedIllness: 0,
							successCode: 200,
							message: 'Illness List',
							body: {
								selectdIllness: [],
								allIllness: Illness,
							}

						}
						res.status(200).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavlid Authorization Key or Authorization Key Empty',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async forgot_password(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('phone', 'phone field is required').notEmpty();
			req.check('country_code', 'country_code field is required').notEmpty();
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let CheckPhone = await users.check_Valid_Phone(req.body);

				if (CheckPhone != '') {
					if (CheckPhone[0].email == '') {
						var FullNumber = CheckPhone[0].phone_code.concat(CheckPhone[0].phone_number);
						let auth_key = helpers.create_auth();
						var Response = await users.update_unique_hash(CheckPhone, auth_key);
						if (Response != '') {
							var baseUrl = "https://6m36d.api.infobip.com/sms/1/text/single";
							var headers = {
								//"Authorization": "Basic Um9kdWNhdGUwMTp1Z3JIUWkybVpCcDdxejQ=",
								"Authorization": "Basic 0e3840ec74275595db4ac71f44d4a53c-fcce95c3-8218-4cf3-a1b2-32fc521c17ec",
								"Content-Type": "application/json"
							};
							let config = {
								headers: headers
							}
							//https://admin.ductour.com/api/
							var toData = {
								"to": FullNumber,
								"text": 'Click Here To Reset Your Password ... <a href="https://admin.ductour.com/api/forget_password/' + auth_key + '">Click</a>'
							};
							console.log(toData, "=============toData");
							let datass = await axios.post(baseUrl, toData, config);
							var datas = {
								status: 'success',
								successCode: 200,
								message: ' Reset Link Sent Successfully to Your Mobile Number',
								body: {}

							}
							res.status(200).send(datas);
						}

					} else {
						let auth_key = helpers.create_auth();
						var Response = await users.update_unique_hash(CheckPhone, auth_key);
						console.log(Response != '', "=============Response");
						if (Response != '') {
							var datas = {
								status: 'success',
								successCode: 200,
								message: ' Reset Link Sent Successfully to Your Email',
								body: {}

							}
							res.status(200).send(datas);
							helpers.send_email(auth_key, CheckPhone[0].email);
						}
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 400,
						message: 'This Mobile Number is not Registred ',
						body: {}

					}
					res.status(400).send(datas);
				}
			}
		} catch (error) {
			throw error
		}
	}
	async genrate_policy(req, res) {
		try {
			if (req.body.policy_type == 1) {
				req.check('policy_type', 'policy_type field is required').notEmpty()
				req.check('security_key', 'security_key field is required').notEmpty()
				req.check('auth_key', 'auth_key field is required').notEmpty();
				//req.check('illness_ids', 'illness_ids field is required').notEmpty();
				req.check('hospital_id', 'hospital_id field is required').notEmpty();
				req.check('type', 'type field is required').notEmpty();
			} else {
				req.check('policy_type', 'policy_type field is required').notEmpty()
				req.check('security_key', 'security_key field is required').notEmpty()
				req.check('auth_key', 'auth_key field is required').notEmpty();
				//req.check('illness_ids', 'illness_ids field is required').notEmpty();
				req.check('hospital_id', 'hospital_id field is required').notEmpty();
				req.check('type', 'type field is required').notEmpty();
				req.check('transaction_id', 'transaction_id field is required').notEmpty();
				// req.check('amount', 'amount field is required').notEmpty();
				// req.check('card_no', 'card_no field is required').notEmpty();
				// req.check('expiry_month_year', 'expiry_month_year field is required').notEmpty();
			}

			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				if (auth != '') {
					if (req.body.policy_type == 1) {
						let GotPolicy = await claimlist.policy_generation(req.body, req.headers);

						if (GotPolicy[0] && GotPolicy[0].error) {
							var datas = {
								status: 'error',
								successCode: GotPolicy[0].code,
								message: GotPolicy[0].message,
								body: {
									claim_request_id: 0,
									policy_number: "",
									message: ""
								}
							}
							res.status(GotPolicy[0].code).send(datas);

						} else {
							var datas = {
								status: 'success',
								successCode: 200,
								message: 'Policy',
								body: GotPolicy[0]

							}
							res.status(200).send(datas);
						}
					} else {
						let GotPolicy = await claimlist.paid_genrate_policy(req.body, req.headers);

						if (GotPolicy[0] && GotPolicy[0].error) {
							var datas = {
								status: 'error',
								successCode: GotPolicy[0].code,
								message: GotPolicy[0].message,
								body: {
									claim_request_id: 0,
									policy_number: "",
									message: ""
								}
							}
							res.status(GotPolicy[0].code).send(datas);

						} else {
							var datas = {
								status: 'success',
								successCode: 200,
								message: 'Policy',
								body: GotPolicy[0]

							}
							res.status(200).send(datas);
						}
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavlid Authorization Key or Authorization Key Empty',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async child_details(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				var Auth = await users.check_auths(req.headers.auth_key);
				if (Auth != '') {
					let child_detail = await users.childInfo(Auth);
					let Parent_Details = await users.get_parent(req.headers.auth_key);

					child_detail.push(Parent_Details[0]);
					//Parent_Details[0].push(child_detail);
					var datas = {
						status: 'success',
						successCode: 200,
						message: 'Child’s Details',
						body: child_detail.reverse()


					}
					res.status(200).send(datas);
					/* if(child_detail!=''|| Parent_Details!='' ){
						var datas = {
							status: 'success',
							successCode: 200,
							message: ' Parent & Child Details',
							body:details
						
					
						}
						res.status(200).send(datas);
					}else{
						var datas = {
							status: 'success',
							successCode: 200,
							message: 'You Do not Have Any Child',
							body:child_detail
							
						}
						res.status(200).send(datas); */
					//}
					//console.log(child_detail);
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavlid Authorization Key or Authorization Key Empty',
						body: {}

					}
					res.status(403).send(datas);
				}
			}


		} catch (err) {
			throw err;
		}
	}
	async phone_otp(req, res) {
		try {

			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('phone', 'phone field is required').notEmpty();
			req.check('country_code', 'country_code field is required').notEmpty();
			req.check('name', 'name field is required').notEmpty();
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let result = await users.get_otp(req.body);
				if (result != '') {
					var FullNumber = req.body.country_code.concat(req.body.phone);
					var baseUrl = "https://6m36d.api.infobip.com/sms/1/text/single";
					//var baseUrl = "https://6m36d.api.infobip.com/sms/2/text/advanced";	
					var headers = {
						//"Authorization": "Basic Um9iZXJ0YW5kam9obmx0ZDpAMDZ1NUBuOUA=",
						"Authorization": "Basic cmFuZGpsdGQ6QEZyNzQzQEoyISM=",
						"Content-Type": "application/json",
						"Accept": "application/json"
					};

					
					let config = {
						headers: headers
					}
					// console.log(headers,"===================");
					var toData = {
						"from": "DUCTOUR",
						"to": FullNumber,
						"text": "Your Ductour Sign Up Verification Otp is :" + result,
					};

					let data = await axios.post(baseUrl, toData, config);
					console.log(data.data.messages, "================??");



					var datas = {
						status: 'success',
						successCode: 200,
						message: 'Otp Sent to your Mobile Number',
						body: {}



					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'success',
						successCode: 400,
						message: 'This Number is Already Registered',
						body: {}

					}
					res.status(400).send(datas);
				}
			}

		} catch (err) {
			throw err;
		}
	}
	async resend_otp(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('phone', 'phone field is required').notEmpty();
			req.check('country_code', 'country_code field is required').notEmpty();
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let result = await users.get_resend__otp(req.body);
				if (result != '') {
					var FullNumber = req.body.country_code.concat(req.body.phone);
					var baseUrl = "https://6m36d.api.infobip.com/sms/1/text/single";
					var headers = {
						"Authorization": "Basic Um9kdWNhdGUwMTp1Z3JIUWkybVpCcDdxejQ=",
						"Content-Type": "application/json"
					};
					let config = {
						headers: headers
					}
					var toData = {
						"to": FullNumber,
						"text": "Your Ductour Sign Up Verification Otp is :" + result,
					};
					await axios.post(baseUrl, toData, config);
					// const accountSid = 'AC6da9b68df11752c3baee130b74a52c90';
					// const authToken = '53661ef2d57980204438b15f83c7d1fe';
					// const client = require('twilio')(accountSid, authToken);

					// client.messages
					// 	.create({
					// 		body: 'Your  Ductour  Sign Up Varification Otp is :' + result,
					// 		from: '+12025099336',
					// 		to: FullNumber
					// 	})
					// 	.then(message => console.log(message.sid));
					var datas = {
						status: 'success',
						successCode: 200,
						message: 'Otp Sent to your Mobile Number',
						body: {}

					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'success',
						successCode: 400,
						message: 'This Number is Already Registered',
						body: {}

					}
					res.status(400).send(datas);
				}
			}

		} catch (err) {
			throw err;
		}
	}
	async varify_otp(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('phone', 'phone field is required').notEmpty();
			req.check('otp', 'otp field is required').notEmpty();
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				/* let auth= await users.check_auths(req.headers.auth_key);
				if(auth!=''){ */

				let varify = await users.check_otp(req.body);
				if (varify != '') {
					var datas = {
						status: 'success',
						successCode: 200,
						message: 'Otp Varification Successful',
						body: {}

					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 400,
						message: 'Invalid Otp Or Number Not Registred',
						body: {}

					}
					res.status(400).send(datas);
				}
			}
			/* else{
						var datas = {
							status: 'error',
							successCode: 403,
							message: 'Inavlid Authorization Key or Authorization Key Empty'
					
						}
						res.status(403).send(datas);
					}
				} */
		} catch (error) {
			throw error;
		}
	}
	async generate_unique_id(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();
			//req.check('illness_id', 'illness_id field is required').notEmpty();
			req.check('UserId', 'UserId field is required').notEmpty();
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				if (auth != '') {

					let checkuser = await claimlist.checkIllness(req.body, req.headers);
					let Hospital = await claimlist.get_hospital(checkuser[0].hospital_id);
					let AllIllness = await illneses.getAllMy(req.body.UserId);
					let allMyPolicy = await claimlist.getAllPolicy(req.body.UserId);
					let RemainingIllness = await illneses.getreaminingIll(req.body.UserId);
					//console.log(AllIllness,"========allMyPolicy");return;
					if (AllIllness != RemainingIllness) {
						for (let k in allMyPolicy) {
							console.log(allMyPolicy[k].counts < 4, "======check 4");
							if (allMyPolicy[k].counts < 4) {
								//if (checkuser != '') {
								let otp = await claimlist.unique_code(checkuser, req.body, auth, Hospital, RemainingIllness, AllIllness, allMyPolicy[k]);
								if (otp != '') {
									var datas = {
										status: 'success',
										successCode: 200,
										message: 'View Unique Code',
										body: {
											value: otp,
											Hospitals: Hospital[0],
										}
									}
									res.status(200).send(datas);
									break;
								}
								// } else {
								// 	var datas = {
								// 		status: 'error',
								// 		successCode: 400,

								// 		message: 'You are Used all Your Illness',
								// 		body: {
								// 			value: "",
								// 			Hospitals: {},
								// 		}
								// 	}
								// 	res.status(400).send(datas);
								// }

								//	}
							}
						}
					} else {
						console.log("8 completed");
						var datas = {
							status: 'error',
							successCode: 400,

							message: 'You are Used all Your Illness',
							body: {
								value: "",
								Hospitals: {},
							}
						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavlid Authorization Key or Authorization Key Empty',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (error) {
			throw error
		}
	}
	async health_tips(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('type', 'type field is required').notEmpty();
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let health_tips = await healthtips.get_healtips_details(req.body);
				if (health_tips != '') {
					var datas = {
						status: 'Success',
						successCode: 200,
						message: 'Health Tips List',
						body: health_tips
					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 400,
						message: 'No Health Tips Found',
						body: {}

					}
					res.status(400).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async get_profile_details(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				if (auth != '') {
					let PolicyDetails = await claimlist.get_policy_details(auth[0].id);
					console.log(PolicyDetails, "=======PolicyDetails");
					let finalDate = ''
					if (PolicyDetails == '') {
						PolicyDetails = ''
					}
					let Details = await users.get_users(auth);
					if (Details != '') {
						var datas = {
							status: 'Success',
							successCode: 200,
							message: 'Users Details',
							body: {
								users: Details[0],
								PolicyDetails: PolicyDetails[0]
							},


						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'Success',
							successCode: 200,
							message: 'No Details found',
							body: {}

						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Authorization Key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async term_condition(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let getData = await users.get_term_condition();
				if (getData != '') {
					var datas = {
						status: 'error',
						successCode: 200,
						message: 'Terms and Conditions',
						body: getData[0]

					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 400,
						message: 'Error While Getting Data',
						body: {}

					}
					res.status(400).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async privacy_policy(req, res) {
		try {
			sss
			req.check('security_key', 'security_key field is required').notEmpty()
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let getData = await users.get_privacy_policy();
				if (getData != '') {
					var datas = {
						status: 'error',
						successCode: 200,
						message: 'Privacy Policy  Data',
						body: getData[0]

					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 400,
						message: 'Error While Getting Data',
						body: {}

					}
					res.status(400).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async get_cookie(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let getData = await users.getcookie();
				console.log(getData, "====");
				if (getData) {
					var datas = {
						status: 'error',
						successCode: 200,
						message: 'Cookie Policy Data',
						body: getData[0]

					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 400,
						message: 'Error While Getting Data',
						body: {}

					}
					res.status(400).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async Change_password(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty()
			req.check('old_password', 'old_password field is required').notEmpty()
			req.check('new_password', 'new_password field is required').notEmpty()
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auths = await users.check_auths(req.headers.auth_key);

				if (auths != '') {
					let CheckOld = await users.check_old_pass(req.body.old_password, req.headers.auth_key);

					if (CheckOld != '') {
						let ChangePass = await users.change_password(CheckOld, req.body.new_password);
						if (ChangePass != '') {
							var datas = {
								status: 'error',
								successCode: 200,
								message: 'Password Updated Successfully',
								body: ChangePass
							}
							res.status(200).send(datas);
						}
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: 'Invalid Old Password',
							body: {}
						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Authorization Key',
						body: {}

					}
					res.status(403).send(datas);
				}

			}
		} catch (err) {
			throw err;
		}
	}
	async notification_on_off(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty()
			req.check('type', 'type field is required').notEmpty()
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				if (auth != '') {
					let notification = await users.update_notification(auth, req.body.type);
					if (notification != '') {
						var datas = {
							status: 'Success',
							successCode: 200,
							message: 'Notification Updated',
							body: notification

						}
						res.status(200).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Authorization Key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			console.log(err);
		}
	}
	async post_review(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty()
			req.check('hospital_id', 'hospital_id field is required').notEmpty()
			req.check('rating', 'rating field is required').notEmpty()
			req.check('comment', 'comment field is required').notEmpty()
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				if (auth != '') {
					let Result = await users.InsertReview(auth, req.body);
					if (Result != '') {
						var datas = {
							status: 'Success',
							successCode: 200,
							message: 'Feedback Successful',
							body: {}

						}
						res.status(200).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Authorization Key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			console.log(err);
		}
	}
	async get_review(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty()
			req.check('hospital_id', 'hospital_id field is required').notEmpty()
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}


				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				if (auth != '') {
					let Result = await users.get_review(req.body, auth);
					if (Result != '') {
						var datas = {
							status: 'Success',
							successCode: 200,
							message: 'Review Details',
							body: Result[0]

						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'success',
							successCode: 200,
							message: 'No Review Details',
							body: {}

						}
						res.status(403).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Authorization Key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async get_healthgames(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()


			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let data = ''
				sponsers.get_heal1thgames(data, function (AllGames) {
					if (AllGames != '') {
						var datas = {
							status: 'success',
							successCode: 200,
							message: 'ALl Health Games',
							body: AllGames

						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: 'No Games Found',
							body: {}

						}
						res.status(400).send(datas);
					}
				});
			}
		} catch (err) {
			throw err;
		}
	}
	async get_faq(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()


			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let Result = await faq.get_faqs();
				if (Result != '') {
					var datas = {
						status: 'success',
						successCode: 200,
						message: 'FAQ',
						body: Result

					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 400,
						message: 'No Faq Founds',
						body: {}

					}
					res.status(400).send(datas);
				}
			}
		} catch (error) {
			throw error;
		}
	}
	async generate_paasword(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty()
			req.check('password', 'password field is required').notEmpty()


			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let authKey = await users.check_auths(req.headers.auth_key);
				if (authKey != '') {
					let NewPass = await users.got_first_password(req.body, authKey);
					console.log(NewPass, 'NewPass');
					if (NewPass != '') {
						var datas = {
							status: 'success',
							successCode: 200,
							message: 'Password Generated Successfully',
							body: {}

						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: 'Some Problem When Generating Password',
							body: {}

						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Auth_key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async users_illness_listing(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('userId', 'userId field is required').notEmpty()


			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				//console.log(req.headers.auth_key);return false;
				/* let auths= await users.check_auths(req.headers.auth_key);
				if(auths!=''){ */
				let [GetUserIllness] = await illneses.GetParticularIllness(req.body.userId);
				let AllIllness = await illneses.getAllMy(req.body.userId);
				let RemainingIllness = await illneses.getreaminingIll(req.body.userId);
				if (GetUserIllness != '') {
					var datas = {
						status: 'success',
						successCode: 200,
						message: 'Selected Treatment List',
						AllIllnessCount: AllIllness,
						AlreadyUsedIllness: RemainingIllness,
						body: GetUserIllness
					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 400,
						message: 'No Illness Found ',
						body: []

					}
					res.status(400).send(datas);
				}
				/* }else{
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Auth_keys',
						body:{}
				
					}
					res.status(403).send(datas);
				} */
			}
		} catch (err) {

			throw err;
		}
	}
	async add_member(req, res) {
		try {
			//console.log(req.body,req.headers);return false;
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty()
			req.check('name', 'name field is required').notEmpty()
			req.check('dob', 'dob field is required').notEmpty()
			/* req.check('image','image field is required').notEmpty() */

			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auths = await users.check_auths(req.headers.auth_key);
				console.log(auths != '', 'auth');
				if (auths != '') {
					let addMember = await users.add_New_member(req.body, req.files, auths);
					if (addMember != '') {
						var datas = {
							status: 'success',
							successCode: 200,
							message: 'Child Added Successfully',
							body: addMember[0]

						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: 'Maximum children that can be added 4',
							body: []

						}
						res.status(403).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Auth_keys',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (error) {
			throw error;
		}
	}
	async child_info(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty()
			/* req.check('image','image field is required').notEmpty() */

			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auths = await users.check_auths(req.headers.auth_key);
				if (auths != '') {
					let Result = await users.get_users_child(auths[0].id);
					let childs = await users.get_child_count(auths[0].id);
					let getPayment = await users.get_set_payment();
					console.log(getPayment, "==========getPayment");
					for (var i in Result) {
						var childPolicy = await claimlist.get_childPolicy(Result[i].id);
						/* 	console.log(childPolicy!='','me'); */
						if (childPolicy != '') {
							Result[i].child_policy = childPolicy;
						} else {
							Result[i].child_policy = 0;
						}
					}
					//var newarray= Result.concat(childPolicy)

					/* 	console.log(Result,'rtht'); */
					if (Result != '') {
						var datas = {
							status: 'success',
							successCode: 200,
							message: 'Child’s Details',
							topt_up_amount: getPayment[0].top_up_amount,
							renew_amount: getPayment[0].renew_amount,
							comment: getPayment[0].comment,
							ChildCount: childs,
							body: Result

						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: 'You Do not Have any Child',
							topt_up_amount: getPayment[0].top_up_amount,
							renew_amount: getPayment[0].renew_amount,
							comment: getPayment[0].comment,
							ChildCount: 0,
							body: []

						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Auth_Key',
						body: []

					}
					res.status(403).send(datas);
				}
			}
		} catch (error) {
			throw error;
		}
	}
	async change_hospital(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty()

			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auths = await users.check_auths(req.headers.auth_key);
				let countryname = req.body.country_name;
				let lat = req.body.lat;
				let long = req.body.long;
				let country_name = req.body.country_name;
				//console.log(auths,"======auths");return false;
				if (auths != '') {
					let Result = await claimlist.hospital_change(auths[0].id, req.body, lat, long, country_name);
					if (Result != '') {
						var datas = {
							status: 'success',
							successCode: 200,
							message: 'Hospital List',
							body: Result

						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'success',
							successCode: 400,
							message: ' No Hospital Listed',
							body: {}
						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Auth_Key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}

		} catch (err) {
			throw err;
		}
	}
	async update_hospital(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty()
			req.check('hospital_id', 'hospital_id field is required').notEmpty()

			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auths = await users.check_auths(req.headers.auth_key);
				if (auths != '') {
					let UpdateValue = await claimlist.update_hospital(req.body, auths[0].id);

					if (UpdateValue !== '') {
						var datas = {
							status: 'success',
							successCode: 200,
							message: 'Hospital Updated Successfully',
							body: {}

						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: ' 3 Updates Used Up',
							body: {}

						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Auth_Key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (error) {
			throw error
		}
	}
	async top_up(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			//req.check('auth_key', 'auth_key field is required').notEmpty()
			//req.check('transaction_id', 'transaction_id field is required').notEmpty()
			req.check('ClaimId', 'ClaimId field is required').notEmpty()
			//req.check('illness_id', 'illness_id field is required').notEmpty()
			req.check('type', 'type field is required 1 = free and 2 = paid').notEmpty()
			req.check('hospital_id', 'hospital_id field is required').notEmpty()
			if (req.body.type == '2') {
				//req.check('hospital_id', 'hospital_id field is required').notEmpty()
				//req.check('transaction_id', 'transaction_id field is required').notEmpty()
				//req.check('amount', 'amount field is required').notEmpty()
				//req.check('card_no', 'card_no field is required').notEmpty()
				//req.check('expiry_month_year', 'expiry_month_year field is required').notEmpty()
			}


			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {

				//	if (auths != '') {
				var UpdateTopUp = "";

				if (req.body.type == '1') {
					//console.log("here");return false;
					UpdateTopUp = await claimlist.update_policy(req.body /* , auths[0].id */ );
					console.log("===========>UpdateTopUp", UpdateTopUp);
					if (UpdateTopUp && UpdateTopUp[0] && UpdateTopUp[0].message) {
						var datas = {
							status: 'error',
							successCode: 410,
							//policy_number:UpdateTopUp,
							message: UpdateTopUp[0].message,
							body: {

							}
						}
						res.status(410).send(datas);
					}
				} else {
					UpdateTopUp = await claimlist.paid_topup(req.body);

					if (UpdateTopUp && UpdateTopUp[0] && UpdateTopUp[0].message) {
						var datas = {
							status: 'error',
							successCode: 411,
							//policy_number:UpdateTopUp,
							message: UpdateTopUp[0].message,
							//policy_id:UpdateTopUp.claim_list.id,
							body: {

							}
						}
						res.status(411).send(datas);
					}
				}

				//If no free sponser available send error

				if (UpdateTopUp != '') {
					var datas = {
						status: 'success',
						successCode: 200,
						message: 'Policy Top Up Successful',
						policy_number: UpdateTopUp[0].policy_number,
						sponserName: UpdateTopUp[0].username,
						sponser_Message: UpdateTopUp[0].sponser_message,
						policy_id: UpdateTopUp[0].claim_id,
						body: {

						}
					}
					res.status(200).send(datas);
				}
				/* else {
							var datas = {
								status: 'success',
								successCode: 200,
								message: 'Free Topup Successful',
								body: {}
									
								

							}
							res.status(200).send(datas);
						}	 */
			}
			/* else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Auth_key',
						body: {}
					}
					res.status(403).send(datas);
				} */
			//}
		} catch (err) {
			throw err;
		}
	}
	async save_transaction(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty()
			req.check('claim_id', 'claim_id field is required').notEmpty()
			req.check('transaction_id', 'transaction_id field is required').notEmpty()
			req.check('amount', 'amount field is required').notEmpty()
			req.check('card_no', 'card_no field is required').notEmpty()
			req.check('expiry_month_year', 'expiry_month_year field is required').notEmpty()

			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auths = await users.check_auths(req.headers.auth_key);
				if (auths != '') {
					let Result = await claimlist.saving_payment(auths[0].id, req.body);
					if (Result != '') {
						var datas = {
							status: 'error',
							successCode: 200,
							message: 'Transaction Details Successfully Saved',
							body: {}
						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: 'Some Error While Saving Details',
							body: {}

						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Auth_Key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (error) {
			throw error;
		}
	}
	async users_left_illness(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('userId', 'userId field is required').notEmpty()


			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				//console.log(req.headers.auth_key);return false;
				/* let auths= await users.check_auths(req.headers.auth_key);
				if(auths!=''){ */
				let GetUserIllness = await illneses.GetleftIllness(req.body.userId);
				let AllIllness = await illneses.getAllMy(req.body.userId);
				let RemainingIllness = await illneses.getreaminingIll(req.body.userId);
				if (GetUserIllness != '') {
					var datas = {
						status: 'success',
						successCode: 200,
						message: 'Selected Treatment List',
						AllIllnessCount: AllIllness,
						AlreadyUsedIllness: RemainingIllness,
						body: GetUserIllness,

					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 400,
						message: 'No Illness Found ',
						body: []

					}
					res.status(400).send(datas);
				}
				/* }else{
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Auth_keys',
						body:{}
				
					}
					res.status(403).send(datas);
				} */
			}
		} catch (err) {

			throw err;
		}
	}

	async notiifcation_cron() {
		try {
			let cronData = await claimlist.cron_notification();
			console.log(cronData)
		} catch (err) {
			throw err;
		}
	}
	async email_update(req, res) {
		//try{
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('userId', 'userId field is required').notEmpty()
			req.check('email', 'email field is required').notEmpty()


			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let CheckUser = await users.checkingUserId(req.body.userId);
				if (CheckUser != '') {
					let UpdateValue = await users.updateEmail(CheckUser[0].id, req.body.email);
					//console.log(UpdateValue,'UpdateValue')
					if (UpdateValue == 1) {
						var datas = {
							status: 'success',
							successCode: 200,
							message: 'User Email Updated Successfully',
							body: {}

						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: 'Some Erorr While Updating',
							body: {}

						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 400,
						message: 'User Not Found',
						body: {}

					}
					res.status(400).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async policy_expire_cron(req, res) {
		try {
			let cron = await users.policy_cron_expire();
		} catch (err) {
			throw err;
		}
	}
	async healthgames_listing(req, res) {
		try {
			if (!req.headers.auth_key) {
				var datas = {
					status: 'error',
					successCode: 403,
					message: 'Kindly send auth key',
					body: {}

				}
				res.status(403).send(datas);
				return false;
			}
			let auths = await users.check_auths(req.headers.auth_key);
			if (auths != '') {
				let [healthGamesData] = await sponsers.getAllHealthgames(req);
				var datas = {
					status: 'success',
					successCode: 200,
					message: 'Data Retrieved Successfully',
					body: healthGamesData
				}

				res.status(200).send(datas);
			} else {
				var datas = {
					status: 'error',
					successCode: 403,
					message: 'Inavalid Auth_key',
					body: {}

				}
				res.status(403).send(datas);
			}
		} catch (err) {
			throw err;
		}
	}
	async edit_profile(req, res) {
		try {
			let auths = await users.check_auths(req.headers.auth_key);

			if (auths != '') {
				var UpdateValue = "";
				var messageSnd = "";
				if (req.files) {
					UpdateValue = await users.update_user_image(req.files, auths[0].id);
					messageSnd = "Image Upload Successful";
				} else if (req.body.bloodgroup) {

					UpdateValue = await users.update_user_blood(req.body.bloodgroup, auths[0].id);
					messageSnd = "Blood Group Updated Successfully";
				}
				let UserDetails = await users.check_auths(req.headers.auth_key);

				if (UpdateValue == 1) {
					var datas = {
						status: 'success',
						successCode: 200,
						message: messageSnd,
						body: UserDetails[0]

					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 400,
						message: 'Error while Uplaod',
						body: {}

					}
					res.status(400).send(datas);
				}
			} else {
				var datas = {
					status: 'error',
					successCode: 403,
					message: 'Inavalid Auth_key	',
					body: {}

				}
				res.status(403).send(datas);
			}
		} catch (err) {
			throw err;
		}
	}
	async getNotifications(req, res) {
		try {
			//console.log(req.files,req.headers.auth_key);return false;
			let auths = await users.check_auths(req.headers.auth_key);
			if (auths != '') {

				let [getNotifications] = await db.db_connect.execute('SELECT * FROM `notify` WHERE `user_id` = ?  || user_id = ? order by id  DESC   LIMIT 10', [auths[0].id, 0]);
				/* console.log("SELECT Count(*) as totalCount FROM `notify` WHERE `user_id` = ? || `user_id`=?  and `is_read`= ?", [auths[0].id,'0','0']); */

				let [getNotificationsCount] = await db.db_connect.execute("SELECT Count(*) as totalCount FROM `notify` WHERE  `user_id`=?  and `is_read`= ?", [auths[0].id, '0']);

				var datas = {
					status: 'success',
					successCode: 200,
					message: 'Data Retirieved Successfully',
					body: {
						notifications: getNotifications,
						unread_count: getNotificationsCount[0].totalCount
					}

				}
				res.status(200).send(datas);
			} else {
				var datas = {
					status: 'error',
					successCode: 403,
					message: 'Inavalid Auth_key	',
					body: {}

				}
				res.status(403).send(datas);
			}
		} catch (err) {
			throw err;
		}
	}
	async readNotification(req, res) {
		try {

			let auths = await users.check_auths(req.headers.auth_key);
			if (auths != '') {
				console.log(req.body.notification_id);
				if (req.body.notification_id) {
					await db.db_connect.execute("update `notify` set is_read='1' WHERE `user_id` = ? and `id`= ? ", [auths[0].id, req.body.notification_id]);

				} else {
					await db.db_connect.execute("update `notify` set is_read='1' WHERE `user_id` = ? ", [auths[0].id]);
				}

				var datas = {
					status: 'success',
					successCode: 200,
					message: 'Notification updated Successfully',
					body: {}

				}
				res.status(200).send(datas);
			} else {
				var datas = {
					status: 'error',
					successCode: 403,
					message: 'Inavalid Auth_key	',
					body: {}

				}
				res.status(403).send(datas);
			}
		} catch (err) {
			res.status(400).send(err.message);
		}
	}
	async get_paid_sponser(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('hospital_id', 'hospital_id field is required').notEmpty()

			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',

				}
				res.status(400).send(datas);
			} else {
				let details = await claimlist.get_sponser_paid(req.body.hospital_id);

				var datas = {
					status: 'success',
					successCode: 200,
					message: 'Paid Sponsors Status',
					body: {
						sponser_found: details
					}

				}
				res.status(200).send(datas);
			}
		} catch (err) {
			throw err;
		}
	}
	async get_hospital_review(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('hospital_id', 'hospital_id field is required').notEmpty()



			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',

				}
				res.status(400).send(datas);
			} else {
				let AvgRating = await claimlist.get_avg_review(req.body.hospital_id);
				console.log(AvgRating, "======");
				let HospitalReview = await claimlist.get_Particular_review(req.body.hospital_id);
				if (HospitalReview != '') {
					var datas = {
						status: 'success',
						successCode: 200,
						Average_Rating: AvgRating,
						message: 'Hospital Review List',
						body: HospitalReview

					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'success',
						successCode: 200,
						Average_Rating: '',
						message: 'No Feedback for This Hospital',
						body: []

					}
					res.status(200).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async change_child_image(req, res) {
		try {
			//console.log(req.body.child_id,req.files);
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('child_id', 'hospital_id field is required').notEmpty()
			//req.check('image', 'image field is required').notEmpty()



			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',

				}
				res.status(400).send(datas);
			} else {
				let CheckUser = await users.checkUserExist(req.body.child_id);
				if (CheckUser != '') {
					let UpdateDetails = await users.changeImage(req.files.image, CheckUser[0].id);
					if (UpdateDetails) {
						var datas = {
							status: 'success',
							successCode: 200,
							message: 'Child Image changed',
							body: UpdateDetails[0]

						}
						res.status(200).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 400,
						message: 'User Not Exists',
						body: {}

					}
					res.status(400).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async getAllIllness(req, res) {
		try {
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',

				}
				res.status(400).send(datas);
			} else {
				let Illness = await illneses.get_illneses_api();
				if (Illness != '') {
					var datas = {
						status: 'success',
						successCode: 200,
						message: 'ALl Illness List',
						body: Illness

					}
					res.status(400).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 400,
						message: 'NO Illness Found',
						body: []

					}
					res.status(400).send(datas);
				}
			}

		} catch (err) {
			throw err;
		}
	}
	async check_exist_policy(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',

				}
				res.status(400).send(datas);
			} else {
				let validAuth = await users.check_auths(req.headers.auth_key);
				if (validAuth != '') {
					let CheckPolicy = await claimlist.check_policy_exist(validAuth[0].id);
					var datas = {
						status: 'error',
						successCode: 200,
						message: 'User Policy Exist Details',
						PolicyCount: CheckPolicy
					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavalid Auth_key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async get_rating_details(req, res) {
		try {

			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
				}
				res.status(400).send(datas);
			} else {
				let validAuth = await users.check_auths(req.headers.auth_key);
				if (validAuth != '') {
					let checkratinggiven = await users.check_rating_read(validAuth[0].id);

					if (checkratinggiven != '') {
						var datas = {
							status: 'success',
							successCode: 200,
							//rate_given:"1",
							message: 'Rating Details',
							body: checkratinggiven[0]

						}
						res.status(200).send(datas);
					} else {
						console.log("no details");
						var datas = {
							status: 'success',
							successCode: 200,
							//rate_given:"0",
							message: 'Rating Details',
							body: {
								"id": 0,
								"user_id": 0,
								"hospital_id": 0,
								"is_read": 2,
								"hospital_name": ''

							}

						}
						res.status(200).send(datas);

					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavalid Auth_key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async get_faqs(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',

				}
				res.status(400).send(datas);
			} else {
				let getFaqs = await contents.findAllFaqs();
				if (getFaqs != '') {
					var datas = {
						status: 'success',
						successCode: 200,
						//rate_given:"1",
						message: 'Rating Details',
						body: getFaqs
					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavalid Auth_key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async get_privacy(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',

				}
				res.status(400).send(datas);
			} else {
				let getFaqs = await contents.getPrivacy();
				if (getFaqs != '') {
					var datas = {
						status: 'success',
						successCode: 200,
						//rate_given:"1",
						message: 'Privacy Data',
						body: getFaqs[0]
					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavalid Auth_key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async get_terms(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',

				}
				res.status(400).send(datas);
			} else {
				let getFaqs = await contents.getTerms();
				if (getFaqs != '') {
					var datas = {
						status: 'success',
						successCode: 200,
						//rate_given:"1",
						message: 'Terms Data',
						body: getFaqs[0]
					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavalid Auth_key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async changecountry(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty();
			req.check('auth_key', 'auth_key field is required').notEmpty();

			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',

				}
				res.status(400).send(datas);
			} else {
				let validAuth = await users.check_auths(req.headers.auth_key);
				if (validAuth != '') {
					let changeCountry = await users.chnageCountry(req.body, validAuth[0].id);
					if (changeCountry == 1) {
						var datas = {
							status: 'success',
							successCode: 200,
							//rate_given:"1",
							message: 'Country Updated Successfully',
							body: {}
						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: 'Some Error Occured',
							body: {}

						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavalid Auth_key',
						body: {}

					}
					res.status(403).send(datas);
				}

			}
		} catch (err) {
			throw err;
		}
	}
	async search_hospital(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty();
			req.check('auth_key', 'auth_key field is required').notEmpty();
			req.check('name_location', 'name_location field is required').notEmpty();

			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',

				}
				res.status(400).send(datas);
			} else {
				let validAuth = await users.check_auths(req.headers.auth_key);
				if (validAuth != '') {
					let getdata = await claimlist.search_hospital(req.body.name_location);
					if (getdata) {
						var datas = {
							status: 'success',
							successCode: 200,
							message: 'All Hospital Listed',
							body: getdata
						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: 'No Hospital Listed',
							body: {}

						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavalid Auth_key',
						body: {}

					}
					res.status(403).send(datas);
				}

			}
		} catch (err) {
			throw err;
		}
	}
	
	async get_restaurants(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();
			req.check('lat', 'lat field is required').notEmpty();
			req.check('long', 'long field is required').notEmpty();

			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				if (auth != '') {

					//  let Details = await db.db_connect.execute("select ducmeal.*,ducmeal.longi,ducmeal.lat,(3959 * acos( cos( radians("+req.body.lat+") ) * cos( radians(ducmeal.lat ) ) * cos( radians( ducmeal.longi ) - radians("+req.body.long+") ) + sin( radians("+req.body.lat+") ) * sin(radians(ducmeal.lat)) ) ) AS distance from ducmeal   order by distance asc ")

					let Details = await db.db_connect.execute("select ducmeal.*,ducmeal.longi,ducmeal.lat,(3959 * acos( cos( radians(" + req.body.lat + ") ) * cos( radians(ducmeal.lat ) ) * cos( radians( ducmeal.longi ) - radians(" + req.body.long + ") ) + sin( radians(" + req.body.lat + ") ) * sin(radians(ducmeal.lat)) ) ) AS distance from ducmeal   order by distance asc ");

					if (Details != '') {
						var datas = {
							status: 'Success',
							successCode: 200,
							message: 'Restaurant lists',
							body: Details[0]


						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'Success',
							successCode: 200,
							message: 'No Details found',
							body: {}

						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Authorization Key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async addRestForDucMeal(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();
			req.check('rest_id', 'rest_id field is required').notEmpty();
			req.check('claim_id', 'claim_id field is required').notEmpty();


			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				// console.log(auth,"==========");return;
				if (auth != '') {

					let get_restaurants = await db.db_connect.execute('select * from ducmeal where id=?', [req.body.rest_id]);

					let getlatestpolicy = await db.db_connect.execute('select id from claim_list where user_id=?', [auth[0].id]);
					let Policy_number = []
					//console.log(getlatestpolicy[0].length);return;
					if (getlatestpolicy[0].length > 0) {
						let getpolicynumber = await db.db_connect.execute('select id,policy_number from claim_list_illness where claim_request_id=?', [getlatestpolicy[0][0].id]);
						console.log(getpolicynumber[0][0].policy_number);
						Policy_number.push(getpolicynumber[0][0].policy_number)
					}



					if (get_restaurants != '') {
						
						//Genrerate meal code for restuarant  and sending the push notification//

						let final_data = '';
						var digits = '0123456789';
						var otp = "";
						for (let i = 0; i < 4; i++) {
							otp += digits[Math.floor(Math.random() * 10)];
						}

						final_data = otp;

						var notification = {
							device_token: auth[0].device_token,
							device_type: auth[0].device_type,
							title: " You are entitled to a complimentary Duc Meal.Your Meal code : '" + final_data + "'  can Use only in '"+get_restaurants[0][0].name+"' ",
							// message: "Your Meal code is '"+final_data+"'",
							notification_code: 3232,
							body: {
								otp: final_data, //generated otp
							}
						};
						console.log(notification);
						//helpers.send_mealcode_notification(notification, auth[0].id, auth[0].zone_seconds);

						//Sending the sms to the user regarding the meal code//

						var FullNumber = auth[0].phone_code.concat(auth[0].phone_number);
						var baseUrl = "https://6m36d.api.infobip.com/sms/1/text/single";
						//var baseUrl = "https://6m36d.api.infobip.com/sms/2/text/advanced";	
						var headers = {
							//"Authorization": "Basic Um9iZXJ0YW5kam9obmx0ZDpAMDZ1NUBuOUA=",
							"Authorization": "Basic cmFuZGpsdGQ6QEZyNzQzQEoyISM=",
							"Content-Type": "application/json",
							"Accept": "application/json"
						};

						let config = {
							headers: headers
						}
						// console.log(headers,"===================");
						var toData = {
							"from": "DUCTOUR",
							"to": FullNumber,
							"text": "  You are entitled to a complimentary Duc Meal.Your Meal code :'"+final_data+"' and can only be use in '"+get_restaurants[0][0].name+"'" ,
						};

						let data = await axios.post(baseUrl, toData, config);
						console.log(data.data.messages, "===========sms")
						// save  the meal code according to user and restorent id//
						console.log('insert into ducmeal_code set user_id=?,code=?,claim_id=?,is_verified=?,rest_id=?', [auth[0].id, final_data, req.body.claim_id, 0, req.body.rest_id]);
						let savemealcode = await db.db_connect.execute('insert into ducmeal_code set user_id=?,code=?,claim_id=?,is_verified=?,rest_id=?', [auth[0].id, final_data, req.body.claim_id, 0, req.body.rest_id])
						var datas = {
							status: 'Success',
							successCode: 200,
							message: 'Restaurant Details ',
							mealcode: final_data,
							body: {
								resturantDetails: get_restaurants[0],
								Policy_number: Policy_number[0]
							}
						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'Success',
							successCode: 200,
							message: 'No Details found',
							body: {}

						}
						res.status(400).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Authorization Key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async get_member_info(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();
			//req.check('member_id', 'member_id field is required').notEmpty();


			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				//console.log(auth,"========auth");
				if (auth != '') {


					let getallmember = await db.db_connect.execute('select * from users where is_parent=? order by id desc', [auth[0].id]);
					//console.log(auth[0].id,"========get");return;
					let Policy_expiry = [];
					let memberdata = [];
					for (let i in getallmember[0]) {
						//console.log(getallmember[0][i].id,"=======get")
						//console.log(getallmember[0][i].member_type==1 || getallmember[0][i].member_type==2,"===ceck")
						if (getallmember[0][i].member_type == 1 || getallmember[0][i].member_type == 2) {

							let getlatestpolicy = await db.db_connect.execute('select id from claim_list where user_id=? order by id desc limit 1', [getallmember[0][i].id]);

							console.log('select id from claim_list where user_id=? order by id desc limit 1', [getallmember[0][i].id]);
							//let getlatestpolicy= await db.db_connect.execute('select  IFNULL(ducmeal_code.code,0) AS meal_code,claim_list.id as id from claim_list left join ducmeal_code on  claim_list.id=ducmeal_code.claim_id where claim_list.user_id=? order by id desc limit 1',[getallmember[0][i].id])
							//console.log(getlatestpolicy[0].length>0,"=======getlatestpolicy")
							if (getlatestpolicy[0].length > 0) {
								//	console.log(getlatestpolicy[0][0].id,"=====getlatestpolicy[0][0].id]");
								// console.log('select IFNULL(ducmeal_code.code,0) AS mealcode,claim_list_illness.id as id,policy_number,expiry_date from claim_list_illness left join ducmeal_code on ducmeal_code.claim_id= claim_list_illness.claim_request_id where claim_request_id=?',[getlatestpolicy[0][0].id]);

								let getpolicynumber = await db.db_connect.execute('select IFNULL(ducmeal_code.code,0) AS mealcode,claim_list_illness.id as id,policy_number,expiry_date from claim_list_illness left join ducmeal_code on ducmeal_code.claim_id= claim_list_illness.claim_request_id where claim_request_id=?', [getlatestpolicy[0][0].id])
								console.log(getpolicynumber[0][0], "=======check");
								memberdata.push(getallmember[0][i]);
								getallmember[0][i].meal_code = getpolicynumber[0][0].mealcode

								let currenttime = Math.round(new Date().getTime() / 1000);

								if (currenttime > getpolicynumber[0][0].expiry_date) {
									getallmember[0][i].is_expired = "1"
								} else {
									getallmember[0][i].is_expired = "0"
								}
								//get child policies//

								var childPolicy = await claimlist.get_childPolicy([getallmember[0][i].id]);
								//console.log(childPolicy != '','me in ---------policy exists'); 
								if (childPolicy != '') {
									getallmember[0][i].child_policy = childPolicy;
								} else {
									getallmember[0][i].child_policy = 0;
								}
								//console.log(getallmember[0][i],"===========in if")

							}
							// else{
							// 	let getallmembers= await db.db_connect.execute('select * from users where is_parent=? and otp_is_varified=? order by id desc',[auth[0].id,1]);
							// 	console.log(getallmember[0][i],"=======");
							// 	//get child policies//

							// 	var childPolicy = await claimlist.get_childPolicy([getallmember[0][i].id]);
							// 	console.log(childPolicy,"=========childPolicy");
							// 	if (childPolicy != '') {
							// 		getallmember[0][i].child_policy = childPolicy;
							// 	} else {
							// 		getallmember[0][i].child_policy = 0;
							// 	}
							// 	getallmember[0][i].is_expired="";
							// 	getallmember[0][i].child_policy=childPolicy
							// 	memberdata.push(getallmember[0][i]);	
							// }
						} else {
							//	console.log("----------------here in child",getallmember[0][i].id)

							let getlatestpolicy = await db.db_connect.execute('select id from claim_list where user_id=? order by id desc limit 1', [getallmember[0][i].id]);
							//console.log(getlatestpolicy[0][0].id, "================in else");

							if (getlatestpolicy[0].length > 0) {
								// let getpolicynumber= await db.db_connect.execute('select id,policy_number,expiry_date from claim_list_illness where claim_request_id=?',[getlatestpolicy[0][0].id]);

								let getpolicynumber = await db.db_connect.execute('select IFNULL(ducmeal_code.code,0) AS mealcode,claim_list_illness.id as id,policy_number,expiry_date from claim_list_illness left join ducmeal_code on ducmeal_code.claim_id= claim_list_illness.claim_request_id where claim_request_id=?', [getlatestpolicy[0][0].id])
								//	console.log(getpolicynumber[0][0],"=======check");
								memberdata.push(getallmember[0][i]);
								getallmember[0][i].meal_code = getpolicynumber[0][0].mealcode

								//memberdata.push(getallmember[0][i]);

								let currenttime = Math.round(new Date().getTime() / 1000);

								if (currenttime > getpolicynumber[0][0].expiry_date) {
									getallmember[0][i].is_expired = "1"
								} else {
									getallmember[0][i].is_expired = "0"
								}
								//get child policies//

								var childPolicy = await claimlist.get_childPolicy([getallmember[0][i].id]);
								//console.log(childPolicy != '','me in ---------policy exists'); 
								if (childPolicy != '') {
									getallmember[0][i].child_policy = childPolicy;
								} else {
									getallmember[0][i].child_policy = 0;
								}
							}
							//console.log(getallmember[0][i],"===========in else")
							// else{
							// 	let getallmembers= await db.db_connect.execute('select * from users where is_parent=?  order by id desc',[auth[0].id]);
							// 	//console.log(getallmember[0][i],"=======");
							// 	//get child policies//

							// 	var childPolicy = await claimlist.get_childPolicy([getallmember[0][i].id]);

							// 	if (childPolicy != '') {
							// 		getallmember[0][i].child_policy = childPolicy;
							// 	} else {
							// 		getallmember[0][i].child_policy = 0;
							// 	}
							// 	getallmembers[0][i].is_expired="";
							// 	getallmembers[0][i].child_policy=childPolicy
							// 	memberdata.push(getallmembers[0][i]);	
							// }
							//console.log(memberdata,"===========memberdata")
						}
					}
					var datas = {
						status: 'Success',
						successCode: 200,
						message: 'Members Policy Details ',
						body: memberdata

					}
					res.status(200).send(datas);


				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Authorization Key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async add_pac(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();
			req.check('no_of_person', 'no_of_person field is required').notEmpty();
			req.check('type', 'type field is required').notEmpty();


			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				if (auth != '') {

					//save choice in member chioce table//
					let savechioce = await db.db_connect.execute('insert into memberChoice set user_id=?,type=?,numberofperson=?,verifedmember=?', [auth[0].id, req.body.type, req.body.no_of_person, 0]);

					if (savechioce) {
						var datas = {
							status: 'Success',
							successCode: 200,
							message: 'Choice filled successfully',
							body: {}

						}
						res.status(200).send(datas);
					}


				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Authorization Key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async add_members(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();
			req.check('name', 'name field is required').notEmpty();
			req.check('phone_code', 'phone_code field is required').notEmpty();
			req.check('phone_number', 'phone_number field is required').notEmpty();
			req.check('relation', 'relation field is required').notEmpty();
			req.check('dob', 'dob field is required').notEmpty();
			req.check('type', 'type field is required').notEmpty();
			req.check('device_type', 'device_type field is required').notEmpty();
			req.check('device_token', 'device_token field is required').notEmpty();


			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);

				if (auth != '') {

					//check existing username//
					
					let getuser=[];
					if(req.body.type==3){
						 getuser = await db.db_connect.execute('select id,username,phone_number from users where (username=? or phone_number=?) and (id!=? and type=?)', [req.body.name, req.body.phone_number,auth[0].id,req.body.type]);
						
					}else{
						getuser = await db.db_connect.execute('select id,username,phone_number from users where (username=? or phone_number=?) ', [req.body.name,req.body.phone_number]);
					}	
					

				//	console.log(getuser[0],"=======getuser");return;
					// and is_parent!==?
					if (getuser[0].length <= 0) {
						//
						var digits = '0123456789';
						var password = '';
						for (let i = 0; i < 4; i++) {
							password += digits[Math.floor(Math.random() * 10)];
						}
						 var hash='';
						 //console.log(req.body.password,"=======req.body.password");return;
						 if(req.body.password ==undefined){
							 req.body.password='';
						 }
						if(req.body.type==1){

							var hash = helpers.crypt(req.body.password);
						}

						var otp = "";
						var digits = '0123456789';
						for (let i = 0; i < 4; i++) {
							otp += digits[Math.floor(Math.random() * 10)];
						}

						let image_name = "";
						if (req.files && req.files.image != '') {
							image_name = helpers.new_image_Upload(req.files.image);
						}
						let _image_names = (typeof image_name == 'undefined') ? '' : image_name;
						image_name = 'https://admin.ductour.com/images/users/' + _image_names;
						console.log(image_name, "==================");

						//get the users choice from memberChoice//

						let getdata = await db.db_connect.execute('select * from memberChoice where user_id=? order by id desc limit 1', [auth[0].id]);
						
						let savemember = '';
						let getuserdata = {};
						let leftmember = 0;

						if (getdata) {
							console.log(req.body.password,"=======passwrod")
							//entry of the members in the user Table//
							console.log('insert into users set is_parent=?,username=?,relation=?,phone_code=?,phone_number=?,image=?,dob=?,varify_otp=?,member_type=?,password=?,exact_pass=?,device_type=?,device_token=?', [auth[0].id, req.body.name, req.body.relation, req.body.phone_code, req.body.phone_number, image_name, req.body.dob, otp, req.body.type, hash, req.body.password, req.headers.device_type, req.headers.device_token]);

							let savememberuser = await db.db_connect.execute('insert into users set is_parent=?,username=?,relation=?,phone_code=?,phone_number=?,image=?,dob=?,varify_otp=?,member_type=?,password=?,exact_pass=?', [auth[0].id, req.body.name, req.body.relation, req.body.phone_code, req.body.phone_number, image_name, req.body.dob, otp, req.body.type, hash, req.body.password]);

							//update is_seen status//

							let updateseen= await db.db_connect.execute('update users set is_seen=? where id=?',[1,auth[0].id]);
							
							//sending th singup otp after registration to all type  1 and type 2 of members//

							if (req.body.type == 0 || req.body.type == 1 || req.body.type == 2) {
								var FullNumber = req.body.phone_code.concat(req.body.phone_number);
								console.log(FullNumber, "========FullNumber");
								var baseUrl = "https://6m36d.api.infobip.com/sms/1/text/single";
								//var baseUrl = "https://6m36d.api.infobip.com/sms/2/text/advanced";	
								var headers = {
									//"Authorization": "Basic Um9iZXJ0YW5kam9obmx0ZDpAMDZ1NUBuOUA=",
									"Authorization": "Basic cmFuZGpsdGQ6QEZyNzQzQEoyISM=",
									"Content-Type": "application/json",
									"Accept": "application/json"
								};
								let config = {
									headers: headers
								}
								// console.log(headers,"===================");
								var toData = {
									"from": "DUCTOUR",
									"to": FullNumber,
									"text": "Your Signup Verification code  :" + otp,
								}
								let datas = await axios.post(baseUrl, toData, config);
								console.log("for login toData================??", toData);
								console.log("for login data================??", datas, );

							}

							////////////////////////////////////////////////////////////////////

							//seding sms to the users +otp


							//save  member  in familyMembers table//
							console.log("====================ddd",getdata);
							console.log('insert into familyMembers set users_id=?,memberchoice_id=?,type=?,familyMemberId=?', [auth[0].id, getdata[0][0].id, req.body.type, savememberuser[0].insertId],"==========checking");
							
							savemember = await db.db_connect.execute('insert into familyMembers set users_id=?,memberchoice_id=?,type=?,familyMemberId=?', [auth[0].id, getdata[0][0].id, req.body.type, savememberuser[0].insertId]);

							//get user details//
							getuserdata = await db.db_connect.execute('select * from users where id=?', [savememberuser[0].insertId]);

							//console.log(getuserdata[0][0], "==================tosend push")

							//sending push to the new user

							//let data = await axios.post(baseUrl, toData, config);
						//	console.log(" for signup otp================??", toData);
							//Sending Push Notification to the user//

							if (req.body.type == 0 || req.body.type == 1 || req.body.type == 2) {

								var notification = {
									device_token: getuserdata[0][0].device_token,
									device_type: getuserdata[0][0].device_type,
									title: "Your Signup Verification code : " + otp,
									//title:"Verification Code",
									notification_code: 2222,
									body: {}
								};

								helpers.send_otpverfivation_notification(notification, auth[0].id, auth[0].zone_seconds);
							}


							//get the left member to add //


							let getexisitng = await db.db_connect.execute('select count(id) as id from familyMembers where users_id=? and memberchoice_id=?', [auth[0].id, getdata[0][0].id]);
							console.log(getexisitng[0][0].id, "===========getex");

							leftmember = parseInt(getdata[0][0].numberofperson - parseInt(getexisitng[0][0].id));
							console.log(leftmember, "======");

						}
						if (savemember != '') {
							var datas = {
								status: 'Success',
								successCode: 200,
								message: 'Member Added Successfully',
								body: {
									memberdata: getuserdata[0][0],
									leftmembers: leftmember
								}

							}
							res.status(200).send(datas);

						} else {
							var datas = {
								status: 'error',
								successCode: 400,
								message: 'Please try again',
								body: {}

							}
							res.status(400).send(datas);
						}
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: 'Username or Mobile number already registred please try with another !!',
							body: {}

						}
						res.status(400).send(datas);
					}

				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Authorization Key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async delete_member(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();
			req.check('member_id', 'member_id field is required').notEmpty();


			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				if (auth != '') {
					let checkuser = await db.db_connect.execute('select id from users where id=?', [req.body.member_id]);

					if (checkuser[0].length > 0) {
						let deletemember = await db.db_connect.execute('delete from users where id=?', [req.body.member_id]);

						if (deletemember) {
							var datas = {
								status: 'Success',
								successCode: 200,
								message: 'Member Deleted !!',
								body: {}

							}
							res.status(200).send(datas);
						} else {
							var datas = {
								status: 'error',
								successCode: 400,
								message: 'Please try again',
								body: {}

							}
							res.status(400).send(datas);
						}
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: 'User not found !!',
							body: {}

						}
						res.status(400).send(datas);
					}



				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Authorization Key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async verify_member(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();
			req.check('member_id', 'member_id field is required').notEmpty();
			req.check('otp', 'otp field is required').notEmpty();


			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				if (auth != '') {

					let checkotp = await db.db_connect.execute('select id from users where id=? and varify_otp=?', [req.body.member_id, req.body.otp]);

					if (checkotp[0].length > 0) {
						const [update_is_varify] = await db.db_connect.execute('update users set otp_is_varified=? where id=?', [1, req.body.member_id]);

						// get the last choicedetails

						let getlastchoice = await db.db_connect.execute('select * from memberChoice where user_id=? order by id desc limit 1', [auth[0].id]);

						//console.log);return;
						//update the verifiedmember table

						let newverifedpeson = (getlastchoice[0][0].verifedmember) + 1;
						let uodatenumber = await db.db_connect.execute('update memberChoice set verifedmember=? where user_id=?', [newverifedpeson, getlastchoice[0][0].user_id]);

						//UPDATTING IS VERIED IN MEMBER LIST
						let uodatenumbers = await db.db_connect.execute('update familyMembers set is_verified=? where familyMemberId=?', [1, req.body.member_id]);

						//now getting again verifedmember to caluclate the total amount 

						let getallverifiedmember = await db.db_connect.execute('select * from memberChoice where user_id=? order by id desc limit 1', [auth[0].id]);

						//get the paid amount 

						let getamount = await db.db_connect.execute('select * from  payment');
						let amounttopaid = getamount[0][0].top_up_amount * newverifedpeson

						//get the id of all the verified members//
						let getids = await db.db_connect.execute('select familyMemberId from familyMembers where memberchoice_id=?', [getallverifiedmember[0][0].id]);
						// console.log(getids,"===========getids");
						var datas = {
							status: 'Success',
							successCode: 200,
							message: 'otp verified successfully !!',
							amount_paid: amounttopaid,
							body: {
								memberId: getids[0]
							}

						}
						res.status(200).send(datas);
					} else {
						var datas = {
							status: 'error',
							successCode: 400,
							message: 'Not a valid otp please try again',
							body: {}

						}
						res.status(400).send(datas);
					}

				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Invalid Authorization Key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async childmemberInfo(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty()
			var error = req.validationErrors();
			
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',

				}
				res.status(400).send(datas);
			} else {
				//console.log(req.headers.auth_key,"===============fsfs");return
				let auth = await users.check_auths(req.headers.auth_key);
				console.log(auth,"=================ff");
				//let auth= await db.db_connect.execute('select * from users where  authorization_key=?',[req.headers.auth_key]);
			console.log(auth!='',"===========auth");
				if (auth!='') {
					let getmynewestchoice = await db.db_connect.execute('select * from  memberChoice where user_id=? and type=? order by id desc limit 1',[auth[0].id, 3]);

					// get added member //
					if (getmynewestchoice[0].length > 0) {

						let getid = await db.db_connect.execute('select count(id) as id from familyMembers where memberchoice_id=?', [getmynewestchoice[0][0].id]);
						let getamount = await db.db_connect.execute('select * from  payment');
						let allchildcount = getid[0][0].id;
						let amounttopaid = getamount[0][0].top_up_amount * allchildcount;


						let getids = await db.db_connect.execute('select familyMemberId from familyMembers where memberchoice_id=?', [getmynewestchoice[0][0].id]);

						var datas = {

							status: 'success',
							successCode: 200,
							amount_paid: amounttopaid,
							message: 'Child Member Info',
							body: {
								memberId: getids[0]
							}
						}
						res.status(200).send(datas);
					} else {
						var datas = {

							status: 'success',
							successCode: 200,
							amount_paid: "0",
							message: 'Child Member Info',
							body: {
							}
						}
						res.status(200).send(datas);
					}
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavalid Auth_key',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async member_genratepolicy(req, res) {
		try {
			if (req.body.policy_type == 1) {
				req.check('policy_type', 'policy_type field is required').notEmpty()
				req.check('security_key', 'security_key field is required').notEmpty()
				req.check('auth_key', 'auth_key field is required').notEmpty();
				req.check('user_ids', 'user_ids field is required').notEmpty();
				req.check('hospital_id', 'hospital_id field is required').notEmpty();
				req.check('type', 'type field is required').notEmpty();
			} else {
				req.check('policy_type', 'policy_type field is required').notEmpty()
				req.check('security_key', 'security_key field is required').notEmpty()
				req.check('auth_key', 'auth_key field is required').notEmpty();
				//req.check('illness_ids', 'illness_ids field is required').notEmpty();
				req.check('user_ids', 'user_ids field is required').notEmpty();
				req.check('hospital_id', 'hospital_id field is required').notEmpty();
				req.check('type', 'type field is required').notEmpty();
				req.check('transaction_id', 'transaction_id field is required').notEmpty();
				// req.check('amount', 'amount field is required').notEmpty();
				// req.check('card_no', 'card_no field is required').notEmpty();
				// req.check('expiry_month_year', 'expiry_month_year field is required').notEmpty();
			}
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				if (auth != '') {

					if (req.body.policy_type == 1) {
						var d = new Date();
						var year = d.getFullYear();
						var month = d.getMonth();
						var day = d.getDate();
						var NextYear = new Date(d - month - year + 1);

						let final_user = '';
						let Users = '';
						let Policy_code = '';

						const [UserId] = await db.db_connect.execute('select * from users where id IN (' + req.body.user_ids + ')');
						
						for (let z in UserId) {

							var year = new Date().getFullYear()
							var user = UserId[z].username
							var UsersCode = user.substring(0, 2);
							var name = UsersCode.toUpperCase();
							var nick = "CH";
							var code = Math.floor(100000 + Math.random() * 9000);
							var Policy = (nick + "/" + name + "/" + year + "/" + code);
							Policy_code = Policy
							/////////////////////////////////////////////////////
							final_user = UserId[z].id
							//console.log(final_user,"=========final_user");
							let Final_code = ''
							let checkSponser = ''

							if (req.body.type == 1) {
								checkSponser = 0;

								Final_code = Policy_code
							} else {
								
								let user = '';
								if (!data.child_id) {
									const [users] = await db.db_connect.execute('select id from users where authorization_key=?', [headers.auth_key]);
									user = users;
								} else {
									const [users] = await db.db_connect.execute('select id from users where id=?', [data.child_id]);
									user = users;
								}

								const [result] = await db.db_connect.execute('SELECT DISTINCT(claim_list_illness.policy_number),claim_list.sponser_id from claim_list LEFT JOIN claim_list_illness ON claim_list_illness.claim_request_id=claim_list.id where claim_list.user_id=?', [user[0].id])


								const [last_sponser] = await db.db_connect.execute('select * from claim_list where user_id="' + user[0].id + '" order by id desc');
								checkSponser = last_sponser[0].sponser_id;
								Final_code = result[0].policy_number
							}

							var sponserToGive = 0;

							///
							var Illneses = []

							if (req.body.illness_ids != '') {
								// Illneses =  data.illness_ids.split(",").map(Number);  
								const [getAllIllness] = await db.db_connect.execute('select id from illnesses where is_deleted="0"');
								for (let z in getAllIllness) {
									Illneses.push(getAllIllness[z].id);
								}
							} else {
								const [getAllIllness] = await db.db_connect.execute('select id from illnesses where is_deleted="0"');
								for (let z in getAllIllness) {
									Illneses.push(getAllIllness[z].id);

								}
							}
							let final_data = '';
							var AllIlness = Illneses.length;
							var totalIllness = (Illneses.length - 1);
							var first = true;
							for (let i in Illneses) {
								if (!first) {
									final_data += " , ";
								} else {
									first = false;
								}
								final_data += " '" + Illneses[i] + "'";


							}

							// Check if free sponsers available
							const [getActiveSponsers] = await db.db_connect.execute('select * from policies where is_deleted="0" and expiry_date>now()');
							// console.log(getActiveSponsers,"============getActiveSponsers");return false;
							var NxtSponser = 0;
							if (checkSponser == 0) {
								var query = "SELECT policies.id,sponser_login.id as sponser_id ,sponser_login_id FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id LEFT JOIN policies ON policies.sponsorID=sponser_login.id WHERE sponser_login.type='2'and  sponser_illness.illness_id IN (" + final_data + ") and sponser_login.is_deleted= 0  and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1  GROUP BY sponser_login_id ";


								var [getFreeSponser] = await db.db_connect.execute(query);

								if (getFreeSponser && getFreeSponser[0] && getFreeSponser[0].sponser_id) {
									NxtSponser = getFreeSponser[0].sponser_id;
								} else {
									var datas = {

										status: 'error',
										successCode: 410,
										message: 'Sponser Not Found',
										body: {

										}
									}
									res.status(200).send(datas);
									// return [{message:'Free Sponser Not Available',error:true,code:410}];
								}
							} else {

								// Get Next Sponser to Last Policy Sponser
								var query = "SELECT  sponser_login.id as sponser_id ,sponser_login_id FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id LEFT JOIN policies ON policies.sponsorID=sponser_login.id WHERE sponser_login.id >  '" + checkSponser + "' and sponser_login.type='1'  and   sponser_illness.illness_id IN (" + final_data + ") and sponser_login.is_deleted= 0 and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1 GROUP BY sponser_login_id HAVING count(*) = " + AllIlness;
								//console.log(query,"================query");return  false;

								var [getNextToLastPolicySponser] = await db.db_connect.execute(query);
								if (getNextToLastPolicySponser && getNextToLastPolicySponser[0] && getNextToLastPolicySponser[0].sponser_id) {
									NxtSponser = getNextToLastPolicySponser[0].sponser_id;
								} else {
									// Check Free Again
									var query2 = "SELECT  sponser_login.id as sponser_id ,sponser_login_id FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id LEFT JOIN policies ON policies.sponsorID=sponser_login.id WHERE sponser_login.type='1' and  sponser_illness.illness_id IN (" + final_data + ") and sponser_login.is_deleted= 0  and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1  GROUP BY sponser_login_id HAVING count(*) = " + AllIlness;
									var [getFreeSponser] = await db.db_connect.execute(query2);
									if (getFreeSponser && getFreeSponser[0] && getFreeSponser[0].sponser_id) {
										NxtSponser = getFreeSponser[0].sponser_id;
									} else {
										var datas = {

											status: 'error',
											successCode: 410,
											message: 'Sponser Not Found',
											body: {

											}
										}
										res.status(200).send(datas);
										// return [{message:'Free Sponser Not Available',error:true,code:410}];
									}
								}
							}
							let newData = '';
							var getSponserQuery = "SELECT sponser_login.id as sponser_id , sponser_login_id ,policies.id,policies.expiry_date FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id left join policies on policies.sponsorID=policies.id WHERE sponser_login.id='" + NxtSponser + "'";
							const [AllotedSponser] = await db.db_connect.execute(getSponserQuery);
							//console.log(AllotedSponser,"=====================getSponserQuery");
							if (AllotedSponser) {
								const [PolicyId] = await db.db_connect.execute('select id from policies where sponsorID=?', [AllotedSponser[0].sponser_login_id]);
								//console.log(UserId[z].id,"=======users");
								let qs = "";
								let firsts = true;
								// for (let i in Illneses)
								// {

								if (firsts) {
									firsts = false;
								} else {
									qs += ",";
								}
								qs += "(" + AllotedSponser[0].sponser_login_id + "," + req.body.hospital_id + ",'" + UserId[z].id + "','" + PolicyId[0].id + "',0)";
								// } 

								const [saveclaim] = await db.db_connect.execute("INSERT INTO claim_list (sponser_id,hospital_id,user_id,policy_id,payment_status) VALUES " + qs);

								//save in claimlist illness

								var start = Math.floor(Date.now() / 1000)
								var nextYear = start + 3.154e+7;
								let q = "";
								let first = true;
								for (let i in Illneses) {

									if (first) {
										first = false;
									} else {
										q += ",";
									}
									q += "(" + saveclaim.insertId + "," + Illneses[i] + ",'" + Final_code + "','" + nextYear + "','" + start + "')";
								}
								const [SaveSeparateIll_id] = await db.db_connect.execute("INSERT INTO claim_list_illness (claim_request_id,illness_id,policy_number,expiry_date,claim_date) VALUES " + q);

								// const[Details]= await db.db_connect.execute('select  claim_request_id,policy_number,message from claim_list_illness left join claim_list on claim_list.id= claim_list_illness.claim_request_id where claim_list_illness.id=?',[SaveSeparateIll_id.insertId]);
								// let countIllness= SaveSeparateIll_id.affectedRows
								let countIllness = 1
								const [TotalIll] = await db.db_connect.execute('select policy_left from policies where sponsorID=?', [AllotedSponser[0].sponser_login_id]);

								var remaining = TotalIll[0].policy_left - countIllness;

								// var getSponserFinal = "SELECT id,username,sponser_message FROM sponser_login WHERE id= " +AllotedSponser[0].sponser_login_id;
								// const [sponserDataFinal] = await db.db_connect.execute(getSponserFinal);
								//console.log(sponserDataFinal[0],"sponserDataFinal");
								const [UpdateReamingPolicy] = await db.db_connect.execute('update policies set policy_left=? where sponsorID=?', [remaining, AllotedSponser[0].sponser_login_id]);
								//console.log(UpdateReamingPolicy,'UpdateReamingPolicy');
								// if (sponserDataFinal && sponserDataFinal[0] && sponserDataFinal[0].sponser_message){
								// 	Details[0].message = sponserDataFinal[0].sponser_message;
								// 	Details[0].username = sponserDataFinal[0].username;
								//  }
								await db.db_connect.execute("INSERT into user_used_free_sponsers(user_id,sponser_id) values('" + final_user + "','" + AllotedSponser[0].sponser_login_id + "')");

								var datas = {

									status: 'success',
									successCode: 200,
									message: 'Member policy Success',
									body: {

									}
								}
								res.status(200).send(datas);

							} else {
								var datas = {

									status: 'error',
									successCode: 410,
									message: 'Sponser Not Found',
									body: {

									}
								}
								res.status(410).send(datas);
								//return [{message:'Sponser Not Found',error:true,code:410}];
							}

						}
					} else {
						console.log("==========coming");
						var d = new Date();
						var year = d.getFullYear();
						var month = d.getMonth();
						var day = d.getDate();
						var NextYear = new Date(d - month - year + 1);

						let final_user = '';
						let Users = '';
						let Policy_code = '';

						const [UserId] = await db.db_connect.execute('select * from users where id IN (' + req.body.user_ids + ')');
						
						for (let z in UserId) {

							var year = new Date().getFullYear()
							var user = UserId[z].username
							var UsersCode = user.substring(0, 2);
							var name = UsersCode.toUpperCase();
							var nick = "CH";
							var code = Math.floor(100000 + Math.random() * 9000);
							var Policy = (nick + "/" + name + "/" + year + "/" + code);
							Policy_code = Policy
							/////////////////////////////////////////////////////
							final_user = UserId[z].id
							//console.log(Policy_code,"=========final_user in paid");
							let Final_code = ''
							let checkSponser = ''
							if (req.body.type == 1) {
								checkSponser = 0;

								Final_code = Policy_code
							} else {

								let user = '';
								if (!req.body.child_id) {
									const [users] = await db.db_connect.execute('select id from users where authorization_key=?', [headers.auth_key]);
									user = users;
								} else {
									const [users] = await db.db_connect.execute('select id from users where id=?', [req.body.child_id]);
									user = users;
								}

								const [result] = await db.db_connect.execute('SELECT DISTINCT(claim_list_illness.policy_number),claim_list.sponser_id from claim_list LEFT JOIN claim_list_illness ON claim_list_illness.claim_request_id=claim_list.id where claim_list.user_id=?', [user[0].id])
								const [last_sponser] = await db.db_connect.execute('select * from claim_list where user_id="' + user[0].id + '" order by id desc');
								checkSponser = last_sponser[0].sponser_id;
								// const[CheckExistSPo]= await db.db_connect.execute('select id from sponser_login where id=? and is_deleted=?',[checkSponser,0]);
								Final_code = result[0].policy_number
							}
							var sponserToGive = 0;
							var Illneses = []

							if (req.body.illness_ids != '') {
								// Illneses =  data.illness_ids.split(",").map(Number);  
								const [getAllIllness] = await db.db_connect.execute('select id from illnesses where is_deleted="0"');
								for (let z in getAllIllness) {
									Illneses.push(getAllIllness[z].id);
								}
							} else {
								const [getAllIllness] = await db.db_connect.execute('select id from illnesses where is_deleted="0"');
								for (let z in getAllIllness) {
									Illneses.push(getAllIllness[z].id);

								}
							}
							// console.log(Illneses,"==========Illneses");return false;
							// var Illneses =  data.illness_ids.split(","); 
							let final_data = '';
							var AllIlness = Illneses.length;
							var totalIllness = (Illneses.length - 1);
							var first = true;
							for (let i in Illneses) {
								if (!first) {
									final_data += " , ";
								} else {
									first = false;
								}
								final_data += " '" + Illneses[i] + "'";


							}
							var NxtSponser = 0;
							//console.log(checkSponser==0,"===========checkSponser==0");return;
							if (checkSponser == 0) {
								var query = "SELECT  sponser_login.id as sponser_id ,sponser_login.username as sponsername,sponser_login_id FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id LEFT JOIN policies ON policies.sponsorID=sponser_login.id WHERE sponser_login.type='2'   and  sponser_illness.illness_id IN (" + final_data + ") and sponser_login.is_deleted= 0 and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1 GROUP BY sponser_login_id";
								var [getFreeSponser] = await db.db_connect.execute(query);
								//console.log(getFreeSponser[0].sponsername);return;

								if (getFreeSponser && getFreeSponser[0] && getFreeSponser[0].sponser_id) {
									NxtSponser = getFreeSponser[0].sponser_id;
								} else {
									var datas = {
										status: 'error',
										successCode: 411,
										message: 'No DUC ID Available At This Time.',
										body: {}

									}
									res.status(411).send(datas);
									//return [{message:'No DUC ID Available At This Time.',error:true,code:411}];
								}
							} else {
								//sponser_login.id >  '"+checkSponser+"' and

								// Get Next Sponser to Last Policy Sponser
								var query = "SELECT  sponser_login.id as sponser_id ,sponser_login_id FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id LEFT JOIN policies ON policies.sponsorID=sponser_login.id WHERE  sponser_login.type='2' and sponser_illness.illness_id IN (" + final_data + ") and sponser_login.is_deleted= 0 and policies.expiry_date>= date(now()) and policies.policy_left>=1 GROUP BY sponser_login_id HAVING count(*) = " + AllIlness;
								var [getNextToLastPolicySponser] = await db.db_connect.execute(query);
								if (getNextToLastPolicySponser && getNextToLastPolicySponser[0] && getNextToLastPolicySponser[0].sponser_id) {
									NxtSponser = getNextToLastPolicySponser[0].sponser_id;
								} else {
									// Check paid Again
									var query2 = "SELECT  sponser_login.id as sponser_id ,sponser_login_id FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id LEFT JOIN policies ON policies.sponsorID=sponser_login.id WHERE sponser_login.type='2'  and  sponser_illness.illness_id IN (" + final_data + ") and sponser_login.is_deleted= 0  and policies.expiry_date>= date(now()) and policies.policy_left>=1 and sponser_login.status=1  GROUP BY sponser_login_id HAVING count(*) = " + AllIlness;
									var [getFreeSponser] = await db.db_connect.execute(query2);
									if (getFreeSponser && getFreeSponser[0] && getFreeSponser[0].sponser_id) {
										NxtSponser = getFreeSponser[0].sponser_id;
									} else {
										var datas = {

											status: 'error',
											successCode: 411,
											message: 'No Duc ID Available At This Time',
											body: {

											}
										}
										res.status(411).send(datas);
										//return [{message:'No DUC ID Available At This Time.',error:true,code:411 }];
									}
								}
							}
							let newData = '';
							var getSponserQuery = "SELECT sponser_login.id as sponser_id , sponser_login_id FROM sponser_illness  LEFT JOIN sponser_login ON sponser_login.id= sponser_illness.sponser_login_id  WHERE sponser_login.id='" + NxtSponser + "'";
							const [AllotedSponser] = await db.db_connect.execute(getSponserQuery);
							if (AllotedSponser) {

								const [PolicyId] = await db.db_connect.execute('select id,name from policies where sponsorID=?', [AllotedSponser[0].sponser_login_id]);
								//console.log(PolicyId[0].name,"========PolicyId");return;
								let qs = "";
								let firsts = true;
								// for (let i in Illneses)
								// {

								if (firsts) {
									firsts = false;
								} else {
									qs += ",";
								}
								qs += "(" + AllotedSponser[0].sponser_login_id + "," + req.body.hospital_id + ",'" + UserId[z].id + "','" + PolicyId[0].id + "',1)";
								// } 

								const [saveclaim] = await db.db_connect.execute("INSERT INTO claim_list (sponser_id,hospital_id,user_id,policy_id,payment_status) VALUES " + qs);

								//save in claimlist illness

								var start = Math.floor(Date.now() / 1000)
								var nextYear = start + 3.154e+7;
								let q = "";
								let first = true;
								for (let i in Illneses) {

									if (first) {
										first = false;
									} else {
										q += ",";
									}
									q += "(" + saveclaim.insertId + "," + Illneses[i] + ",'" + Final_code + "','" + nextYear + "','" + start + "')";
								}
								const [SaveSeparateIll_id] = await db.db_connect.execute("INSERT INTO claim_list_illness (claim_request_id,illness_id,policy_number,expiry_date,claim_date) VALUES " + q);
								let countIllness = 1
								const [TotalIll] = await db.db_connect.execute('select policy_left from policies where sponsorID=?', [AllotedSponser[0].sponser_login_id]);

								var remaining = TotalIll[0].policy_left - countIllness;
								const [UpdateReamingPolicy] = await db.db_connect.execute('update policies set policy_left=? where sponsorID=?', [remaining, AllotedSponser[0].sponser_login_id]);

								const [InsertValue] = await db.db_connect.execute('insert into transaction_history set user_id=?,claim_id=?,transaction_id=?,created=?,modified=?', [final_user, saveclaim.insertId, req.body.transaction_id, start, start]);

								//sending sms of the duc id ..

								var FullNumber = UserId[z].phone_code.concat(UserId[z].phone_number);
								console.log(FullNumber, "=========FullNumber");
								var baseUrl = "https://6m36d.api.infobip.com/sms/1/text/single";
								//var baseUrl = "https://6m36d.api.infobip.com/sms/2/text/advanced";	
								var headers = {
									//"Authorization": "Basic Um9iZXJ0YW5kam9obmx0ZDpAMDZ1NUBuOUA=",
									"Authorization": "Basic cmFuZGpsdGQ6QEZyNzQzQEoyISM=",
									"Content-Type": "application/json",
									"Accept": "application/json"
								};

								let config = {
									headers: headers
								}
								// console.log(headers,"===================");
								var toData = {
									"from": "DUCTOUR",
									"to": FullNumber,
									"text": "Welcome to Ductour Your DUC ID is '" + Final_code + "' sponsored by '" + getFreeSponser[0].sponsername + "'",
								};

								let data = await axios.post(baseUrl, toData, config);
								console.log(toData, "===========sms")

								//sending login details to app user only //

								if (UserId[z].member_type == 1) {

									var FullNumber = UserId[z].phone_code.concat(UserId[z].phone_number);
									console.log(FullNumber, "========FullNumber");
									var baseUrl = "https://6m36d.api.infobip.com/sms/1/text/single";
									//var baseUrl = "https://6m36d.api.infobip.com/sms/2/text/advanced";	
									var headers = {
										//"Authorization": "Basic Um9iZXJ0YW5kam9obmx0ZDpAMDZ1NUBuOUA=",
										"Authorization": "Basic cmFuZGpsdGQ6QEZyNzQzQEoyISM=",
										"Content-Type": "application/json",
										"Accept": "application/json"
									};
									let config = {
										headers: headers
									}
									// console.log(headers,"===================");
									var toData = {
										"from": "DUCTOUR",
										"to": FullNumber,
										"text": " Signin into DUCTOUR App to Claim Your Meal, Your Username is :'" + UserId[z].username + "' and Your Password is : '" + UserId[z].exact_pass + "'  Sponsored by :'" + getFreeSponser[0].sponsername + "'"
									}

									let data = await axios.post(baseUrl, toData, config);
									console.log("for login details================??", toData);
								}

								//sending Push of the duc id ..

								if (UserId[z].device_type == 1) {
									var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
									var fcm = new FCM(serverKey);

									var message = {
										to: UserId[z].device_token,

										data: { //you can send only notification or only data(or include both)
											title: "Welcome to Ductour Your DUC ID is '" + Final_code + "' sponsored by '" + getFreeSponser[0].sponsername + "'",
											message: "Welcome to Ductour Your DUC ID is '" + Final_code + "' sponsored by '" + getFreeSponser[0].sponsername + "'",
											notification_code: 1090,
											//body:notification_data.body
										}
									};
									let currenttime = Math.round(new Date().getTime() / 1000);
									let exatctime = currenttime + (UserId[z].zone_seconds);
									console.log(currenttime, "===========currenttime");
									console.log(exatctime, "==============exatctime");

									
									await db.db_connect.execute('Insert into notify set timing=?,user_id=?,message=?,description=?', [exatctime, UserId[z].id, "Welcome to Ductour Your DUC ID is '" + Final_code + "' sponsored by '" + auth[0].username + "'", "Welcome to Ductour Your DUC ID is '" + Final_code + "' sponsored by '" + getFreeSponser[0].sponsername + "'"]);

									//    fcm.send(message, function (err, response) {
									// 	   if (err) {
									// 		   console.log("Something has gone wrong!", err);
									// 	   } else {
									// 		   console.log("Successfully sent with response: ", response);
									// 	   }
									//    });
								} else if (UserId[z].device_type == 2) {
									var serverKey = 'AAAAzrXs8Xc:APA91bHjK2wl5rKXc42mIuE1lvAPNgILNSDHdOozsqbrILde3SN1J422yo0GNVG3UjYvphydDrmcZUujgvB76W8K01uHi2-d-Qx4SCkuqTwlUWt60gVhMXTNmz4KYXPqKMTlY16xa8j5';
									var fcm = new FCM(serverKey);

									var message = {

										///
										to: UserId[z].device_token,
										notification: {
											title: "Welcome to Ductour Your DUC ID is '" + Final_code + "' sponsored by '" + getFreeSponser[0].sponsername + "'",
											message: "Welcome to Ductour Your DUC ID is '" + Final_code + "' sponsored by '" + getFreeSponser[0].sponsername + "'",
											notification_code: 1090,
										},

										contnetType: 1,
										sound: "default",
										body: {
											title: "Welcome to Ductour Your DUC ID is '" + Final_code + "' sponsored by '" + getFreeSponser[0].sponsername + "'",
											message: "Welcome to Ductour Your DUC ID is '" + Final_code + "' sponsored by '" + getFreeSponser[0].sponsername + "'",
											notification_code: 1090,
											// body:[]
										}
									};
									let currenttime = Math.round(new Date().getTime() / 1000);
									let exatctime = currenttime + (UserId[z].zone_seconds);
									console.log(currenttime, "===========currenttime");
									console.log(exatctime, "==============exatctime");



									await db.db_connect.execute('Insert into notify set timing=?,user_id=?,message=?,description=?', [exatctime, UserId[z].id, "Welcome to Ductour Your DUC ID is '" + Final_code + "' sponsored by '" + auth[0].username + "'", "Welcome to Ductour Your DUC ID is '" + Final_code + "' sponsored by '" + getFreeSponser[0].sponsername + "'"]);



									//    fcm.send(message, function (err, response) {
									// 	   if (err) {
									// 		   console.log("Something has gone wrong!", err);
									// 	   } else {
									// 		   console.log("Successfully sent with response: ", response);
									// 	   }
									//    });
								}
								//sending ClaimId in Array//

								//    let [getpolicyDetails] = await db.db_connect.execute('select id,user_id from claim_list where user_id IN ('+req.body.user_ids+') order by id desc')
								//    console.log('select id,user_id from claim_list where user_id IN ('+req.body.user_ids+') order by id desc ')

								let [getpolicyDetails] = await db.db_connect.execute('SELECT cl.id, cl.user_id FROM claim_list AS cl WHERE cl.user_id IN (' + req.body.user_ids + ') HAVING cl.id=(SELECT cli.id FROM claim_list AS cli WHERE cli.user_id=cl.user_id ORDER BY cli.id DESC LIMIT 1) order by id desc')

								//yaha par thik a rha hai but 
								console.log(getpolicyDetails, "-------------getpolicyid in Array");

								var datas = {
									status: 'success',
									successCode: 200,
									message: 'Member policy Success',
									body: {
										policy_number: Final_code,
										name: PolicyId[0].name,
										policy_id: [
											...getpolicyDetails
										]
									}

								}
								console.log(JSON.stringify(datas, null, 2), '=========================================>datas');
								// loop mein response send kr rhe ho i think sir hanji sir apka ek response chala jata hai fir nhi ja rha uske baad  loop mein data dlwate jao fir loop k bahar response send kro achha thik hai krta hoo try sir  loop me dusra kyu nhi ja rha s
								if (z == UserId.length - 1) {
									return res.status(200).send(datas);
								}

							} else {
								var datas = {

									status: 'error',
									successCode: 411,
									message: 'Sponsers Not Found',
									body: {

									}
								}
								res.status(411).send(datas);

							}

						}
					}

				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavlid Authorization Key or Authorization Key Empty',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async meal_status(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty()
			req.check('claim_id', 'claim_id field is required').notEmpty()
			
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				if (auth != '') {
					let getmeastatus = await db.db_connect.execute('select id from ducmeal_code where user_id=? and claim_id=?', [auth[0].id, req.body.claim_id]);
					let checkmeal = 0;

					if (getmeastatus[0].length > 0) {
						checkmeal = 1;
					} else {
						checkmeal = 0;
					}
					console.log(getmeastatus[0]);
					var datas = {
						status: 'success',
						successCode: 200,
						message: 'User Meal Status',
						body: {
							meal_alloted: checkmeal
						}

					}
					res.status(200).send(datas);
				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavlid Authorization Key or Authorization Key Empty',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}
	}
	async addRestForDucMeal_multiple(req, res) {
		try {
			req.check('security_key', 'security_key field is required').notEmpty()
			req.check('auth_key', 'auth_key field is required').notEmpty();
			req.check('rest_id', 'rest_id field is required').notEmpty();
			req.check('claim_id', 'claim_id field is required').notEmpty();
			req.check('user_id', 'user_id field is required').notEmpty();
			var error = req.validationErrors();
			if (error) {
				error[0].status = "false";
				res.send(error[0]);
				return false;
			}
			if (req.headers.security_key != 'ductourapp') {
				var datas = {
					status: 'error',
					successCode: 400,
					message: 'Invalid Security Key',
					body: {}

				}
				res.status(400).send(datas);
			} else {
				let auth = await users.check_auths(req.headers.auth_key);
				if (auth != '') {
					let get_restaurants = await db.db_connect.execute('select * from ducmeal where id=?', [req.body.rest_id]);
					//console.log(get_restaurants[0],"==========");return;

					//getall user details//

					let getuser = await db.db_connect.execute('select * from users where id IN (' + req.body.user_id + ')');

					let claim_ids = req.body.claim_id.split(",");
					console.log(claim_ids)
					//   return



					let emptyArray = [];
					let illnesesValues = "";
					for (let h in getuser[0]) {
						let final_data = '';
						var digits = '0123456789';
						var otp = "";
						for (let i = 0; i < 4; i++) {
							otp += digits[Math.floor(Math.random() * 10)];
						}
						final_data = otp;

						for (let i in claim_ids) {
							if (i == h) {

								illnesesValues += `(${getuser[0][h].id},${claim_ids[i]},'${final_data}',${req.body.rest_id}),`;

								//sending Push Notifaction to users
								var notification = {
									device_token: getuser[0][h].device_token,
									device_type: getuser[0][h].device_type,
									//title: "Your Meal code '" + final_data + "'",
									//message: "Your Meal code '" + final_data + "'",

									title:"  You are entitled to a complimentary Duc Meal.Your Meal code :'"+final_data+"' and can only be use in '"+get_restaurants[0][0].name+"'",

									message:"  You are entitled to a complimentary Duc Meal.Your Meal code :'"+final_data+"' and can only be use in '"+get_restaurants[0][0].name+"'",
									notification_code: 3232,
									body: {
										otp: final_data, //generated otp
									}
								};
								
								//helpers.send_mealcode_notification(notification, auth[0].id, auth[0].zone_seconds);

								// Sending SMS to the users//

								var FullNumber = getuser[0][h].phone_code.concat(getuser[0][h].phone_number);
								var baseUrl = "https://6m36d.api.infobip.com/sms/1/text/single";
								//var baseUrl = "https://6m36d.api.infobip.com/sms/2/text/advanced";	
								var headers = {
									//"Authorization": "Basic Um9iZXJ0YW5kam9obmx0ZDpAMDZ1NUBuOUA=",
									"Authorization": "Basic cmFuZGpsdGQ6QEZyNzQzQEoyISM=",
									"Content-Type": "application/json",
									"Accept": "application/json"
								};

								let config = {
									headers: headers
								}
								// console.log(headers,"===================");
								var toData = {
									"from": "DUCTOUR",
									"to": FullNumber,
									"text": "  You are entitled to a complimentary Duc Meal.Your Meal code :'"+final_data+"' and can only be use in '"+get_restaurants[0][0].name+"'" ,
								};

								let data = await axios.post(baseUrl, toData, config);
								console.log(data.data.messages, "===========sms")
							}
						}
					}
					illnesesValues = illnesesValues.slice(0, -1);

					let query = `INSERT INTO ducmeal_code (user_id,claim_id,code,rest_id) VALUES${illnesesValues}`;
					const [saveducmealcode] = await db.db_connect.execute(query);



					var datas = {
						status: 'Success',
						successCode: 200,
						message: 'Meal Code Generated !!',
						//mealcode:final_data,
						body: {
							//resturantDetails:get_restaurants[0],
							//Policy_number:Policy_number[0]
						}
					}
					res.status(200).send(datas);

				} else {
					var datas = {
						status: 'error',
						successCode: 403,
						message: 'Inavlid Authorization Key or Authorization Key Empty',
						body: {}

					}
					res.status(403).send(datas);
				}
			}
		} catch (err) {
			throw err;
		}

	}
}