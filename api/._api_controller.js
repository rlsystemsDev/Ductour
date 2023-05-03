const Helper = require('../config/helper');
const Users = require('../model/users_model');
/* const Barbar = require('../model/barbar_model');
const Services = require('../model/services_model');
const Booking = require('../model/booking_model'); */
var helpers = '';
var users = '';
/* var barbar='';
var services='';
var booking=''; */
var path = require('path');
module.exports = class Api_controller {

	constructor ()
	{
		helpers = new Helper;
		users = new Users(); 
		/* barbar = new Barbar();
		services = new Services();
		booking = new Booking(); */
	}

	user_signup (req,res)
	{
		try{
			helpers.validateInputs(req, 'signup', function(err, data){
	            if(err){
	                res.status(404).json(data);
	                return false;
	            }
        		else{
        			let crypt = helpers.crypt(req.body.password);
        			req.body.password = crypt; 

	        			users.check_user(req.body,req.headers,function(data){
	        				if(data==''){
	        					users.create_user(req.body,req.headers,function(result){
	        					if(result!=''){
									var datas = {
										status: 'success',
										msg: 'Registration successfull',
										data:result[0]
									}
									res.status(200).send(datas);
								}
							});
        				}else{
        					var datas = {
												status: 'error',
												message: [
													{
															msg:'Email already taken'
													}
												]
											}
								res.status(400).send(datas);
        				}
        			});
						
        		}
        	});
		}catch(err){
			throw err;
		}
	}

	user_login (req, res)
	{
		try{
			helpers.validateInputs(req, 'login', function(err, data){
				 console.log(err);
	            if(err){
	                res.status(404).json(data);
	                throw new error(err);
	                // return false;
	            }
        		else{
        			users.check_users(req.body,req.headers,function(data){
        				// console.log(data);return false;
        				if(data!=''){
        					users.login(req.body, data, function(response){
        						if(response!=''){
	        							var datas = {
										status: 'success',
										msg: 'Login successfull',
										data:response[0]
									}
									res.status(200).send(datas);
        						}
        					});
        				}else{
        					var datas = {
								status: 'error',
								message: [
											{
													msg:'Invalid user credentials'
											}
										]
							}
							res.status(400).send(datas);	
        				}
        			});
        		}
        	});
		}catch(err){
			throw err;
		}
	}

	social_login (req, res)
	{
		try{
			helpers.validateInputs(req, 'social_login', function(err, data){
	            if(err){
	                res.status(404).json(data);
	                return false;
	            }
        		else{
        			users.check_user(req.body,req.headers,function(data){
        				if(data!=''){
        					users.social_login(req.body, data, function(response){
        						if(response!=''){
	        							var datas = {
										status: 'success',
										msg: 'Login successfull',
										data:response[0]
									}
									res.status(200).send(datas);
        						}
        					});
        				}else{
        					users.login_social(req.body,req.headers, function(resp){
        						if(resp!=''){
        							var datas = {
										status: 'success',
										msg: 'Login successfull',
										data:resp[0]
									}
									res.status(200).send(datas);
        						}else{
        							var datas = {
										status: 'error',
										message: [
											{
													msg:'Error while Login'
											}
										]
									}
									res.status(200).send(datas);
        						}
        					});	
        				}
        			});
        		}
        	});
		}catch(err){
			throw err;
		}
	}

	update_password (req, res)
	{
		try{
			helpers.validateInputs(req, "update_password", function(err, data){
				if(err){
	                res.status(404).json(data);
	                return false;
	            }else{
	            	helpers.check_auths(req.headers, function(data){
	            		if(data!=''){
	            			users.update_password(req.body,data[0],function(response){
	            				if(response!=''){
        							var datas = {
										status: 'success',
										msg: 'Update successfull'
									}
									res.status(200).send(datas);
        						}else{
        							var datas = {
										status: 'error',
										message: [
											{
													msg: 'Invalid password'
											}
										]

									}
									res.status(200).send(datas);
        						}
	            			});
	            		}else{
	            			var datas = {
								status: 'error',
								message: [
											{
													msg: 'Invalid auth_key or security_key'
											}
										]
							}
							res.status(400).send(datas);	
	            		}	
	            	});
	            }
			});
		}catch(err){
			throw err;
		}
	}

	get_hair_style_list (req, res)
	{
		try{
			helpers.validateInputs(req, "get_hair_style_list", function(err, data){
				if(err){
	                res.status(404).json(data);
	                return false;
	            }else{
	            	helpers.check_auths(req.headers, function(data){
	            		if(data!=''){
		            		users.get_hair_style_list(req.body, function(response){
		            			if(response!=''){
		            				var datas = {
										status: 'success',
										msg: 'Stylish found',
										data: response
									}
									res.status(200).send(datas);
		            			}else{
		            				var datas = {
										status: 'error',
										message: [
											{
													msg: 'No stylish found'
											}
										]
									}
									res.status(200).send(datas);
		            			}
		            		});
		            	}else{
		            		var datas = {
								status: 'error',
								message: [
											{
													msg: 'Invalid auth_key or security_key'
											}
										]
							}
							res.status(400).send(datas);
		            	}
	            	});
	            }
	        });
		}catch(err){
			throw err;
		}
	}

	forgot_password (req, res)
	{
		try{
			helpers.validateInputs(req, "forgot_password", function(err, data){
				if(err){
	                res.status(404).json(data);
	                return false;
	            }else{
	            	users.check_user (req.body, req.headers,function(data){
	            		if(data!=''){
		            		users.update_auth (data, function(response){
		            			if(response!=''){
		            				helpers.send_email(response,data[0], function(result){
										if(response!=''){
											var datas = {
												status: 'success',
												msg: 'Email sent check your mail',
											}
											res.status(200).send(datas);
										}
		            				})
		            			}
		            		});
		            	}else{
		            		var datas = {
								status: 'error',
								message: [
											{
													msg: 'Invalid security_key'
											}
										]
							}
							res.status(400).send(datas);
		            	}
	            	});
	            }
	        });
		}catch(err){
			throw err;
		}
	}

	url (req, res)
	{
		try{
			users.check_hash(req.params.hash, function(response){
				if(response!=''){
					res.render('reset_password',{title: 'Reset Password',response:response[0],flash:'',hash:req.params.hash});
				}else{
					res.status(404).send('Link has been expired!');
				}
			});
		}catch(err){
			throw err;
		}
	}

	reset_password (req, res)
	{
		try{
			users.check_password(req.body, function(result){
				if(result!=''){
					res.render('success_page',{message:'Password Change successfull'});
				}else{
					res.render('success_page',{message:'Invalid user'});
				}
			});
		}catch(err){
			throw err;
		}
	}

	reset_password (req, res)
	{
		try{
			res.render('success_page',{message:'Invalid user'});
		}catch(err){
			throw err;
		}
	}

	search_stylist (req, res)
	{
		try{
			helpers.validateInputs(req, "search_stylist", function(err, data){
				if(err){
	                res.status(404).json(data);
	                return false;
	            }else{
	            	helpers.check_auths (req.headers,function(data){
	            		if(data!=''){
	            			users.search_stylist(data,req.body, function(response){
	            				if(response!=''){
	            					var datas = {
										status: 'success',
										msg: 'Stylist Found',
										data: response
									}
									res.status(200).send(datas);
	            				}else{
	            					var datas = {
										status: 'error',
										message: [
											{
													msg: 'No Stylist Found',
											}
										]

									}
									res.status(404).send(datas);
	            				}

	            			});
	            		}else{
	            			var datas = {
								status: 'error',
								message: [
											{
													msg: 'Invalid security_key'
											}
										]
							}
							res.status(400).send(datas);
	            		}
	            	});

	            }
	        });
		}catch(err){
			throw err;
		}
	}

	detail_stylist_profile (req, res)
	{
		try{
			helpers.validateInputs(req, "detail_stylist_profile", function(err, data){
				if(err){
	                res.status(404).json(data);
	                return false;
	            }else{
	           		helpers.check_auths (req.headers,function(data){
	            		if(data!=''){
	            			barbar.get_barbar(req.params.stylist_id,function(response){
	            				if(response!=''){
	            					var datas = {
										status: 'success',
										msg: 'Stylist Found',
										data: response[0]
									}
									res.status(200).send(datas);
	            				}else{
	            					var datas = {
										status: 'error',
										message: [
											{
													msg: 'No Stylist Found'
											}
										]
									}
									res.status(404).send(datas);
	            				}
	            			});
	            		}else{
	            			var datas = {
								status: 'error',
								message: [
											{
													msg: 'Invalid auth_key or security_key'
											}
										]
							}
							res.status(400).send(datas);
	            		}
	            	});
	            }
	        });
		}catch(err){
			throw err;
		}
	}

	get_services (req, res)
	{
		try{
			helpers.validateInputs(req, "get_services", function(err, data){
				if(err){
	                res.status(404).json(data);
	                return false;
	            }else{
	            	helpers.check_auths (req.headers,function(data){
	            		if(data!=''){
				            	services.get_all_services(function(response){
				            		if(response!=''){
			        					var datas = {
											status: 'success',
											msg: 'Services Found',
											data: response
										}
										res.status(200).send(datas);
			        				}else{
			        					var datas = {
											status: 'error',
											message:[
													{
															msg: 'No Services Found'
													}
												]
										}
										res.status(404).send(datas);
			        				}
				            	});
				            }else{
				            	var datas = {
									status: 'error',
									message:[		
													{
															msg: 'Invalid auth_key or security_key'
													}
												]
								}
								res.status(400).send(datas);
				            }
				        });
	            }
	        });
		}catch(err){
			throw err;
		}
	}

	hair_cut_records (req, res)
	{
		try{
			helpers.validateInputs(req, "get_services", function(err, data){
				if(err){
	                res.status(404).json(data);
	                return false;
	            }else{
				        helpers.check_auths (req.headers,function(data){
	            		if(data!=''){
				            	booking.get_all_records(data[0],function(response){
				            		if(response!=''){
			        					var datas = {
											status: 'success',
											msg: 'Records Found',
											data: response
										}
										res.status(200).send(datas);
			        				}else{
			        					var datas = {
											status: 'error',
											message:[		
													{
														msg: 'No Record Found'
													}
												]
										}
										res.status(404).send(datas);
			        				}
				            	});
				            }else{
				            	var datas = {
									status: 'error',
									message:[		
													{
														msg: 'Invalid auth_key or security_key'
													}
												]
								}
								res.status(400).send(datas);
				            }
				        });
	            }
	        });
		}catch(err){
			throw err;
		}
	}

	search_record (req, res)
	{
		try{
			helpers.validateInputs(req, "search_stylist", function(err, data){
				if(err){
	                res.status(404).json(data);
	                return false;
	            }else{
	            	helpers.check_auths (req.headers,function(data){
	            		if(data!=''){
				            	booking.search_record(data[0],req.body,function(response){
				            		if(response!=''){
			        					var datas = {
											status: 'success',
											msg: 'Records Found',
											data: response
										}
										res.status(200).send(datas);
			        				}else{
			        					var datas = {
											status: 'error',
											message:[		
													{
														msg: 'No Record Found'
													}
												]
										}
										res.status(404).send(datas);
			        				}
				            	});
				            }else{
				            	var datas = {
									status: 'error',
									message:[		
													{
														msg: 'Invalid auth_key or security_key'
													}
												]
								}
								res.status(400).send(datas);
				            }
				        });
	            }
	        });
		}catch(err){
			throw err;
		}
	}

	edit_profile (req, res)
	{
		try{
			helpers.validateInputs(req, "edit_profile", function(err, data){
				if(err){
	                res.status(404).json(data);
	                return false;
	            }else{
	            	helpers.check_auths (req.headers,function(data){
	            		if(data!=''){
	            			let filename = data[0].photo;
				        	if(req.files.image && req.files.image!=''){
								filename = helpers.image_Uploads(req.files, data[0].photo);

				        	}   
							if(path.extname(filename) !=''){
								filename = filename;
							}else{
								filename = '';	
							}
				        	users.edit_profile (filename,req.body, data, (response)=>{
				        		if(response!=''){
			        					var datas = {
											status: 'success',
											msg: 'Profile Updated successfull',
										}
										res.status(200).send(datas);
		        				}else{
		        					var datas = {
										status: 'error',
										message:[		
													{
														msg: 'Error in Profile update'
													}
												]
									}
									res.status(404).send(datas);
		        				}
				        	})
			            }else{
			            	var datas = {
								status: 'error',
								message:[		
													{
														msg: 'Invalid auth_key or security_key'
													}
												]
							}
							res.status(400).send(datas);
			            }
			        });
	            }
	        });
		}catch(err){		
			throw err;
		}
	}

	stylist_booking (req, res)
	{
		try{
			helpers.validateInputs(req, 'stylist_booking', function(err, data){
				if(err){
					res.status(404).json(data);
	                return false;
				}else{
					req.body.service_id = JSON.parse(req.body.service_id);
					req.body.preferences = JSON.parse(req.body.preferences);
					req.body.date = JSON.parse(req.body.date);
					req.body.time = JSON.parse(req.body.time);
					// console.log(req.body);return false;
					
					helpers.check_auths (req.headers,function(data){
	            		if(data!=''){
	            			booking.check_booking(req.body, data, function(response){
	            				if(response!=''){
									var datas = {
										status: 'error',
										message:[		
													{
														msg: 'Already booked'
													}
												]
									}
									res.status(400).send(datas);
	            				}else{
	            						let filename = '';
										if(req.files.image && req.files.image!=''){
											let files = {
												file:req.files.image
											}
											filename = helpers.image_Upload(files);
										}   
										if(path.extname(filename) !=''){
											filename = filename;
										}
										booking.stylist_booking(data,req.body,filename,(response)=>{
											if(response!=''){
												var datas = {
													status: 'success',
													msg: 'Booking successfull',
													data:response
												}
												res.status(200).send(datas);
											}else{
												var datas = {
													status: 'error',
													message:[		
																{
																	msg: 'Error in booking'
																}
															]
												}
												res.status(404).send(datas);
											}
										});

	            				}
	            			});
	            		}else{
	            			var datas = {
								status: 'error',
								message:[		
													{
														msg: 'Invalid auth_key or security_key'
													}
												]
							}
							res.status(400).send(datas);
	            		}
	            	});
				}
			});
		}catch(err){
			throw err;
		}
	}

	logout (req, res)
	{
		try{
			helpers.validateInputs(req, 'get_services', function(err, data){
				if(err){
					res.status(404).json(data);
	                return false;
				}else{
					helpers.check_auths (req.headers,(data)=>{
						if(data!=''){
	            			users.logout(data, (response)=>{
	            				if(response!=''){
									var datas = {
										status: 'success',
										msg: 'Logout successfull',
									}
									res.status(200).send(datas);
								}else{
									var datas = {
										status: 'error',
										message:[		
													{
														msg: 'Error in logout'
													}
												]
									}
									res.status(404).send(datas);
								}
	            			});
	            		}else{
	            			var datas = {
								status: 'error',
								message:[		
													{
														msg: 'Invalid auth_key or security_key'
													}
												]
							}
							res.status(400).send(datas);
	            		}
	            	});
				}
			});
		}catch(err){
			throw err;
		}
	}


}