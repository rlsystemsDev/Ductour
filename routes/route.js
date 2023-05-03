var AdminController = require('../controller/admin_controller');
var UsersController = require('../controller/users_controller');
var ContentsController = require('../controller/contents_controller');
var faqcontroller = require('../controller/faq_controller');
var policycontroller = require('../controller/policy_controller');
var illnesescontroller = require('../controller/illneses_controller');
var Notifications = require('../controller/notification_controller');
var userillnesescontroller = require('../controller/userillneses_controller');
var policyillnesescontroller = require('../controller/policyillneses_controller');
var healthtipscontroller = require('../controller/healthtips_controller');
var hostpitalcontroller = require('../controller/hospital_controller');
var SponsersController = require('../controller/sponsers_controller');
var insuranceController = require('../controller/insurance_controller');
var hostpitaldashcontroller = require('../controller/hospital/hospitaldash_controller');
var SponsersControlleradmin = require('../controller/sponsers/sponsersadmin_controller');
var claimlistcontroller = require('../controller/sponsers/claimlist_controller');
var SponserillnessController = require('../controller/sponsers/sponser_illness_controller');
var MealController=require('../controller/meal_controller');
var RestroController=require('../controller/restaurantController');
//var ApiController = require('../api/api_controller');
var HmoController = require('../controller/hmo_controller');
var HospitalsController = require('../controller/hopital_login_controller');
var APiController = require('../api/api_controller');
let api = new APiController;
let admin = new AdminController;
let users = new UsersController;
let contents = new ContentsController;
let faq = new faqcontroller;
let policy = new policycontroller;
let illneses = new illnesescontroller;
let userillneses = new userillnesescontroller;
let policyillneses = new policyillnesescontroller;
let healthtips = new healthtipscontroller;
let hospital = new hostpitalcontroller;
let sponsers = new SponsersController;
let insurance = new insuranceController;
let hospitaldash = new hostpitaldashcontroller;
let sponsersadmin = new SponsersControlleradmin;
let claimlist = new claimlistcontroller;
let sponserillness = new SponserillnessController;
let notifications = new Notifications;
//et api = new ApiController;
let hmo = new HmoController;
let hospitals = new HospitalsController;
let meal = new MealController;
let Restro = new RestroController;

module.exports = function (app) {

    //////////////// ADMIN PANEL \\\\\\\\\\\\\\\\\\\\\\\\\\\\
    app.route('/admin').get(admin.admin); //for admin login page
    app.route('/admin/login').post(admin.login); //for admin login check
    app.route('/admin/logout').get(admin.logout); //for admin logout
    app.route('/admin/dashboard').get(admin.dashboard); //for admin dashboard
    app.route('/admin/profile_update').get(admin.profile_update); //for admin dashboard
    app.route('/admin/update').post(admin.update); //for admin dashboard
    app.route('/admin/setting_edit').get(admin.setting_edit); //for admin setting edit
    app.route('/admin/update_setting').post(admin.update_setting);// for setting update
    app.route('/admin/check_password').post(admin.check_password); //for admin check password
    app.route('/admin/check_admin_password').post(admin.check_admin_password); //for admin check password
    app.route('/admin/change_password').post(admin.change_password); //for admin check password
    app.route('/admin/illness_range').get(admin.illness_range);
    app.route('/admin/range_save').post(admin.illness_save);
    app.route('/set_payment').get(admin.set_payment);
    app.route('/payment/save').post(admin.payment_save);

    //Sub Admin Link 
    app.route('/employee').get(admin.employeeList);
    app.route('/employee/create').get(admin.employeecreate);
    app.route('/employee/save').post(admin.employeesave);
    app.route('/employee/edit').get(admin.employeeedit);
    app.route('/employee/update').post(admin.employeeupdate);
    
    app.route('/users').get(users.get_users); //for all users  
    app.route('/users/viewPolicy').get(users.viewPolicy);
    app.route('/users/create').get(users.create); //for create users
    app.route('/users/save').post(users.save);
    app.route('/users/edit').get(users.edit); //for save users
    app.route('/users/views').get(users.views); //for save users
    app.route('/users/delete_data').post(users.delete_data); //for delete record
    app.route('/user_update_status').post(users.update_status_active);//active/deactibe button
    app.route('/users/update_status').post(users.update_status); //for update status
    app.route('/users/get_child').get(users.get_child);
    app.route('/users/child_views').get(users.child_views);
    app.route('/users/get_appointment').get(users.get_appointment);
  
    //app.route('/contents').get(contents.get_contents); //for contents
   // app.route('/faq').get(faq.get_faq);//for faq module
    app.route('/policy').get(policy.get_policy);
    app.route('/policy/views').get(policy.views);
    app.route('/policy/create').get(policy.create);
    app.route('/policy/save').post(policy.save);
    app.route('/policy/edit').get(policy.edit);
    //Item routes
    app.route('/admin/item').get(illneses.get_items);
    app.route('/item/create').get(illneses.item_create);
    app.route('/item/save').post(illneses.item_save);
    app.route('/item/edit').get(illneses.item_edit);

    //Duc meal link

    app.route('/get_meal').get(meal.get_meal);
    app.route('/meal/add').get(meal.add);
    app.route('/meal/save').post(meal.save);
    app.route('/meal/edit').get(meal.edit);
    app.route('/meal/update').post(meal.update);
    app.route('/meal/view').get(meal.view);
    app.route('/update_statuss').post(meal.update_statuss);
    app.route('/meal/delete').post(meal.delete);

    //illneses link

    app.route('/illneses').get(illneses.get_illneses);
    app.route('/illneses/create').get(illneses.create);
    app.route('/illneses/save').post(illneses.save);
    app.route('/illneses/edit').get(illneses.edit);
    app.route('/update_status').post(illneses.update_status);
    app.route('/userillneses').get(userillneses.get_userillneses);
    app.route('/policyillneses').get(policyillneses.get_policyillneses);
    app.route('/healthtips').get(healthtips.get_healthtips);
    app.route('/healthtips/create').get(healthtips.create);
    app.route('/healthtips/save').post(healthtips.save);
    app.route('/hospital').get(hospital.get_sponsorhospital);
    app.route('/hospital/add_hospital').get(hospital.add_hospital);
    app.route('/hospital/edit_hospital').get(hospital.edit_hospital);
    app.route('/hospital/save').post(hospital.save);
    app.route('/hospital/views').get(hospital.hospital_view);
    app.route('/notifications').get(notifications.get_notifications);
    app.route('/notifications/views').get(notifications.views);
    app.route('/notifications/send').get(notifications.sendnotificationview);
    app.route('/notifications/sendnotification').post(notifications.sendnotifications);
    
    //////////////// SPONSER  ADMIN PANEL \\\\\\\\\\\\\\\\\\\\\\\\\\\\  
  
    app.route('/sponsors/healthgames').get(sponsers.healthgames); //for Healthgames Module
    app.route('/sponsors/healthgames_create').get(sponsers.healthgames_create); //for Healthgames Module
    app.route('/sponsors/healthgames_save').post(sponsers.healthgames_save); //save edit for sponsers
    app.route('/sponsors/healthgames_edit').get(sponsers.healthgames_edit); // edit for sponsers
    app.route('/insurance/insurance_list').get(insurance.insurance_list); // edit for sponsers
    app.route('/insurance/insurance_view').get(insurance.insurance_view); //for save users
    app.route('/insurance/claim_list').get(insurance.claim_list); // for insurance claim
    app.route('/insurance/claim_view').get(insurance.claim_view); //for save users
    app.route('/sponsors_list').get(sponsers.get_sponsers); //for save users
    app.route('/update_status_sponsers').post(sponsers.update_status);
    app.route('/insurance/ducmel_claim_list').get(insurance.ducmel_claim_list);
    app.route('/insurance/claim_view_ducmeal').get(insurance.claim_view_ducmeal);
    app.route('/insurance/hospital_claimed').get(insurance.hospital_claimed); 
    app.route('/pay_hospital').post(insurance.pay_hospital);
   
    
    /////////////////////////////sponsers link///////////////////////////////
    app.route('/sponsors/create_sponser').get(sponsers.create_sponser); //for save users
    app.route('/sponsors/save_sposer').post(sponsers.save_sposer); //for save users
    app.route('/sponsors/sponsors_view').get(sponsers.sponsers_view); //for save users
    app.route('/sponsors/sponsor_edit').get(sponsers.sponser_edit); //for save users
    app.route('/healthtips/edit').get(healthtips.edit); //for save users
    app.route('/healthtips/view').get(healthtips.view); //for save users
    app.route('/sponsers/get_sponser_with_details').post(sponsers.get_sponser_with_details);
    app.route('/sponsers/change_password').post(sponsersadmin.change_password);
    app.route('/sponsers/check_password').post(sponsersadmin.check_password); //for admin check password
    app.route('/sponsors').get(sponsersadmin.sponsers);
    app.route('/sponsers/login').post(sponsersadmin.login); //for Sponser login check
    app.route('/sponsors/logout').get(sponsersadmin.logout); //for Sponser logout
    app.route('/sponsors/profileupdate').get(sponsersadmin.profileupdate); // sponsers profile update
    app.route('/sponsers/profile_save').post(sponsersadmin.profile_save);
    app.route('/sponsors/dashboard').get(sponsersadmin.dashboard); //for Sponsordashboard
    app.route('/sponsors/illness_list').get(sponsersadmin.illness_list); //for  illness_list in sponsers
    app.route('/sponsor/hospital_list').get(sponsersadmin.hospital_lists);
    app.route('/sponsors/get_hospitallist').get(sponsersadmin.get_hospitallist); //for Hospital List
    app.route('/sponsers/create').get(sponsersadmin.create); //for  new Hospital add
    app.route('/sponsers/save').post(sponsersadmin.save); //for  new Hospital save 
    app.route('/sponsers/edit').get(sponsersadmin.edit); //for  new Hospital save 
    app.route('/sponsers/view').get(sponsersadmin.view); //for  new Hospital save 
    app.route('/sponsers/get_policies').get(sponsersadmin.get_policies); //for  Policy Module in Sponsers Admin panel 
    app.route('/sponsers/policy_create').get(sponsersadmin.policy_create);// for Policy Create
    app.route('/sponsers/policy_save').post(sponsersadmin.policy_save); // Save Policy Details
    app.route('/sponsers/policy_edit').get(sponsersadmin.policy_edit);
    app.route('/sponsers/policy_view').get(sponsersadmin.policy_view);
    app.route('/sponsers/get__details').post(sponsersadmin.get__details);
    app.route('/sponsers/view_userlists_illness').get(sponsersadmin.view_user_illness);
    app.route('/sponsers/view_userlists_policy').get(sponsersadmin.view_user_policy);
    app.route('/sponsers/get_name').post(sponsers.get_name);
    app.route('/sponsers/check_minValu').post(sponsers.check_minValu);

    app.route('/claimlist/claim_list').get(claimlist.claim_list);
    // app.route('/claimlist/create').get(claimlist.create);
    app.route('/claimlist/get_illness').post(claimlist.get_illness);
    //app.route('/claimlist/claim_save').post(claimlist.claim_save);
    // app.route('/claimlist/claim_edit').get(claimlist.claim_edit);
    app.route('/claimlist/claim_view').get(claimlist.claim_view);
    app.route('/sponserillness/illness_list').get(sponserillness.illness_list);
    app.route('/sponserillness/illness_view').get(sponserillness.illness_view);
    app.route('/sponsers/get_userlists').get(sponsersadmin.get_userlists);
    app.route('/sponsers/view_userlists').get(sponsersadmin.view_userlists);
    //app.route('/healthrewards').get(healthrewards.healthrewards); // for healthreward Module

    //************ HOSPITAL ADMIN *****************************//
    app.route('/hospitaldash').get(hospitaldash.hospitallogin);
    app.route('/hospitaldash/login').post(hospitaldash.login); //for hospital login check 
    app.route('/hospitaldash/dashboard').get(hospitaldash.dashboard); //for hospital dashboard   
    app.route('/hospitaldash/faq').get(hospitaldash.Hospitalfaq); //for hospital faq
    app.route('/hospitaldash/logout').get(hospitaldash.logout); //for hospital logout
    //app.route('/hospitaldash/get_userlist').get(hospitaldash.get_userlist); //for hospital Users List 
    app.route('/hospitaldash/get_hosp_userlist').get(hospitaldash.get_hosp_userlist); //for hospital Users List
    app.route('/hospitaldash/viewAll').get(hospitaldash.viewAll); //for hospital Users  Policy all details
    app.route('/get_illness_items').post(hospitaldash.get_illness_items); 
    app.route('/viewPolicy').get(hospitaldash.viewPolicy); 
    app.route('/viewdoc').post(hospitaldash.viewdoc);
    app.route('/hospitaldash/get_illness_list').get(hospitaldash.get_illness_list); //for hospital Users List
    app.route('/hospitaldash/illness_add').get(hospitaldash.create); //for hospital illness  List edit  
    app.route('/hospitaldash/save').post(hospitaldash.save); //save new  Hospital 
    app.route('/hospitaldash/edit').get(hospitaldash.edit); //for hospital illness  List edit 
    app.route('/hospitaldash/view').get(hospitaldash.view);
    app.route('/hospitaldash/child_view').get(hospitaldash.child_view);
    app.route('/hospitaldash/user_view').get(hospitaldash.user_view);
    app.route('/hospitaldash/get_profile').get(hospitaldash.get_profile_page);
    app.route('/hospitaldash/get_password_page').get(hospitaldash.get_password_page);
    app.route('/hospitaldash/update_hospital_profile').post(hospitaldash.update_hospital_profiles);
    app.route('/hospitaldash/check_password').post(hospitaldash.check_password);
    app.route('/hospitaldash/save_password').post(hospitaldash.save_password);
    app.route('/hospitaldash/policyList').get(hospitaldash.policyList);
    app.route('/hospitaldash/claimnow').post(hospitaldash.claimnow);
    app.route('/hospitaldash/add_claim').get(hospitaldash.add_claim);
    app.route('/hospitaldash/varify_amount').post(hospitaldash.varify_amount);
    //////////////////// hmo Panel ///////////////////

    app.route('/hmo/get_hmo_list').get(hmo.get_hmo_list);
    app.route('/hmo/create').get(hmo.create);
    app.route('/hmo/save').post(hmo.save);
    app.route('/hmo/edit').get(hmo.edit);
    app.route('/hmo/view').get(hmo.view);
    app.route('/update_status').post(hmo.update_status);
    app.route('/hmo/update_claim_status').post(hmo.update_claim_status);


    //HMO admin Panel ///////////////////

    app.route('/agent').get(hmo.hmo_login);
    app.route('/hmo/login').post(hmo.login);
    app.route('/agent/dashboard').get(hmo.dashboard);
    app.route('/agent/logout').get(hmo.logout);
    app.route('/agent/get_policy').get(hmo.get_policy);
    app.route('/agent/claim').get(hmo.claim_list);
    app.route('/claim/edit').get(hmo.claim_list_edit);
    //hospital link in main admin//

    app.route('/hospitals').get(hospitals.hospitals);
    app.route('/hospitals/add').get(hospitals.create);
    app.route('/hospitals/save').post(hospitals.save);
    app.route('/hospitals/edit').get(hospitals.edit);
    app.route('/hospitals/view').get(hospitals.view);
    app.route('/update_statuss').post(hospitals.update_statuss);
    app.route('/get_child').get(users.get_child);
    
    //Resturant Admin Panel..

    app.route('/restaurants').get(Restro.restrologin);
    app.route('/restaurant/login').post(Restro.login);
    app.route('/restaurant/dashboard').get(Restro.dashboard);
    app.route('/restaurant/logout').get(Restro.logout);
    app.route('/restaurant/get_hosp_userlists').get(Restro.get_hosp_userlists);
    app.route('/restaurant/viewAll').get(Restro.viewAll);
    app.route('/restaurant/view').get(Restro.view);
    app.route('/restaurant/claimnow').post(Restro.claimnow);
    app.route('/mealcode/Mealclaimnow').post(Restro.Mealclaimnow);

    //Category ..

    app.route('/get_category').get(admin.category);
    app.route('/add_category').get(admin.add_category);
    app.route('/category_save').post(admin.category_save);
    app.route('/edit_category').get(admin.edit_category);
    app.route('/update_category').post(admin.update_category);
    app.route('/view_category').get(admin.view_category);
    app.route('/delete_category').post(admin.delete_category);
 



  
    ///////////////////////////API'S START//////////////////////////////////////////////////////////////////////////

    app.route('/api/signup').post(api.signup);//done
    app.route('/api/login').post(api.login);//done
    app.route('/api/logout').get(api.logout);//done
    app.route('/api/social_login').post(api.social_login);//done
    app.route('/api/hospital_listing').post(api.hospital_listing);//done
    app.route('/api/illness_listing').post(api.illness_listing);//done
    app.route('/api/forgot_password').post(api.forgot_password);
    app.route('/api/forget_password/:hash').get(users.url);
    app.route("/api/reset_password").post(users.reset_password);
    app.route("/api/genrate_policy").post(api.genrate_policy);
    app.route("/api/child_details").get(api.child_details);
    app.route("/api/phone").post(api.phone_otp);//done
    app.route("/api/varify_otp").post(api.varify_otp);//done
    app.route("/api/generate_unique_id").post(api.generate_unique_id);
    app.route("/api/health_tips").post(api.health_tips);
    app.route("/api/get_profile_details").get(api.get_profile_details);
    app.route("/api/term_condition").get(api.term_condition);
    app.route("/api/Change_password").post(api.Change_password);
    app.route("/api/notification_on_off").post(api.notification_on_off);
    app.route("/api/post_review").post(api.post_review);
    app.route("/api/get_review").post(api.get_review);
    app.route("/api/get_healthgames").get(api.get_healthgames);
    app.route("/api/get_faq").get(api.get_faq);
    app.route("/api/generate_paasword").post(api.generate_paasword);//done
    app.route("/api/users_illness_listing").post(api.users_illness_listing);//done
    app.route("/api/add_member").post(api.add_member);//done
    app.route("/api/child_info").get(api.child_info);//done
    app.route("/api/change_hospital").post(api.change_hospital);//done
    app.route("/api/update_hospital").post(api.update_hospital);//done
    app.route("/api/privacy_policy").get(api.privacy_policy);//done
    app.route("/api/top_up").post(api.top_up);
    app.route("/api/save_transaction").post(api.save_transaction);
    app.route("/api/users_left_illness").post(api.users_left_illness);
    app.route("/api/notiifcation_cron").get(api.notiifcation_cron);
    app.route("/api/policy_expire_cron").get(api.policy_expire_cron);
    app.route("/api/email_update").post(api.email_update);
    app.route("/api/edit_profile").post(api.edit_profile);
    app.route("/api/healthgameslisting").get(api.healthgames_listing);
    app.route('/api/getnotifications').get(api.getNotifications);
    app.route('/api/readnotification').post(api.readNotification);
    app.route('/api/resend_otp').post(api.resend_otp);
    app.route('/api/get_paid_sponser').post(api.get_paid_sponser);
    app.route('/api/get_hospital_review').post(api.get_hospital_review);
    app.route('/api/change_child_image').post(api.change_child_image);
    app.route('/api/getAllIllness').get(api.getAllIllness);
    app.route('/api/check_exist_policy').get(api.check_exist_policy);
    app.route('/api/get_rating_details').get(api.get_rating_details);
    app.route('/api/get_faqs').get(api.get_faqs);
    app.route('/api/get_privacy').get(api.get_privacy);
    app.route('/api/get_terms').get(api.get_terms);
    app.route('/api/changecountry').post(api.changecountry);
    app.route('/api/search_hospital').post(api.search_hospital);
    app.route('/api/get_cookie').get(api.get_cookie);
    app.route('/api/get_restaurants').post(api.get_restaurants);
    app.route('/api/addRestForDucMeal').post(api.addRestForDucMeal);
    app.route('/api/addRestForDucMeal_multiple').post(api.addRestForDucMeal_multiple);
    app.route('/api/get_member_info').post(api.get_member_info);
    app.route('/api/add_pac').post(api.add_pac);
    app.route('/api/add_members').post(api.add_members);
    app.route('/api/delete_member').post(api.delete_member);
    app.route('/api/verify_member').post(api.verify_member);
    app.route('/api/childmemberInfo').get(api.childmemberInfo);
    app.route('/api/member_genratepolicy').post(api.member_genratepolicy);
    app.route('/api/meal_status').post(api.meal_status);

      //////////////Terms & condition  Module//////////////////////
    app.route('/terms').get(contents.term_condition);
    app.route('/update_terms').post(contents.update_term);
    //////////////Terms & condition  Module//////////////////////
    app.route('/about_us').get(contents.about_us);
    app.route('/update_aboutus').post(contents.update_aboutus);
    ///////////// users FAQ//////////////////////
    app.route('/faq').get(contents.faq);
    app.route('/faq/create').get(contents.faq_create);
    app.route('/save_faqs_data').post(contents.save_faqs_data);
    app.route('/update_faqs').get(contents.update_faqs);
    app.route('/update_faqs_data').post(contents.update_faqs_data);
    app.route('/terms_conditions_views').get(contents.terms_conditions_views);
    app.route('/privacy_views').get(contents.privacy_views);
    app.route('/cookie_view').get(contents.cookie_view);

    //Hospital faqs//

    app.route('/faq_hospital').get(contents.faq_hospital);
    app.route('/faq_create_hospital').get(contents.faq_create_hospital);
    app.route('/save_faqs_data_hospital').post(contents.save_faqs_data_hospital);
    app.route('/update_faqs_hospital').get(contents.update_faqs_hospital);
    app.route('/update_faqs_data_hospital').post(contents.update_faqs_data_hospital);
    //////////////cookie Policy Module//////////////////////
    app.route('/cookie').get(contents.get_cookie);
    app.route('/update_cookie').post(contents.update_cookie);
}


