module.exports = class ValidateInput {

    validateInputs(req, type, callback){ //validation by Lallan
        switch(type){
            case 'signup':
                req.assert('username', 'username field is required').notEmpty();
                req.assert('email', 'email field is required').notEmpty();
                req.assert('email', 'valid email is required').isEmail();
                req.assert('phone_number', 'phone_number field is required').notEmpty();
                req.assert('phone_number', 'only number is required').isDecimal();
                req.assert('phone_number', 'length must be 10 characters').isLength({min:10});
                req.assert('country_code', 'country_code field is required').notEmpty();
                req.assert('password', 'password field is required').notEmpty();
                req.assert('password', 'password length must be 8 characters').isLength({min:8});
                req.assert('longitude', 'longitude field is required').notEmpty();
                req.assert('latitude', 'latitude field is required').notEmpty();
                req.assert('device_token', 'device_token field is required').notEmpty();
                req.assert('device_type', 'device_type field is required').notEmpty();
                req.assert('security_key', 'security_key field is required').notEmpty();
                break;
            case 'login':
                req.assert('email', 'email field is required').notEmpty();
                req.assert('email', 'valid email is required').isEmail();
                req.assert('password', 'password field is required').notEmpty();
                req.assert('password', 'password length must be 8 characters').isLength({min:8});
                req.assert('device_token', 'device_token field is required').notEmpty();
                req.assert('device_type', 'device_type field is required').notEmpty();
                req.assert('security_key', 'security_key field is required').notEmpty();
                break;
            case 'logout':
                req.assert('security_key', 'security_key field is required').notEmpty();
                req.assert('authorization_key', 'authorization_key field is required').notEmpty();
                break;
            case 'social_login':
                req.assert('email', 'email field is required').notEmpty();
                req.assert('email', 'valid email is required').isEmail();
                req.assert('password', 'password field is required').notEmpty();
                req.assert('password', 'password length must be 8 characters').isLength({min:8});
                req.assert('device_token', 'device_token field is required').notEmpty();
                req.assert('device_type', 'device_type field is required').notEmpty();
                req.assert('security_key', 'security_key field is required').notEmpty();  
                req.assert('longitude', 'longitude field is required').notEmpty();
                req.assert('latitude', 'latitude field is required').notEmpty();  
                req.assert('social_id', 'social_id field is required').notEmpty();  
                req.assert('social_type', 'social_type field is required').notEmpty();  
                req.assert('username', 'username field is required').notEmpty();  
                break;
            case 'update_password':
                req.assert('old_password', 'email field is required').notEmpty();
                req.assert('old_password', 'old_password length must be 8 characters').isLength({min:8});
                req.assert('new_password', 'phone no field is required').notEmpty();
                req.assert('new_password', 'new_password length must be 8 characters').isLength({min:8});
                req.assert('auth_key', 'device_token field is required').notEmpty();
                req.assert('security_key', 'security_key field is required').notEmpty();
                break;
            case 'get_hair_style_list':
                req.assert('longitude', 'longitude field is required').notEmpty();
                req.assert('latitude', 'latitude field is required').notEmpty();
                req.assert('security_key', 'security_key field is required').notEmpty();
                req.assert('auth_key', 'auth_key field is required').notEmpty();
                break;
            case 'search_stylist':
                req.assert('security_key', 'security_key field is required').notEmpty();
                req.assert('keyword', 'keyword field is required').notEmpty();
                req.assert('auth_key', 'auth_key field is required').notEmpty();
                break;
            case 'detail_stylist_profile':
                req.assert('auth_key', 'auth_key field is required').notEmpty();
                req.assert('security_key', 'security_key field is required').notEmpty();
                req.assert('stylist_id', 'stylist_id field is required').notEmpty();
                break;
            case 'get_services':
                req.assert('auth_key', 'auth_key field is required').notEmpty();
                req.assert('security_key', 'security_key field is required').notEmpty();
                break;
            case 'edit_profile':
                req.assert('auth_key', 'auth_key field is required').notEmpty();
                req.assert('security_key', 'security_key field is required').notEmpty();
                req.assert('email', 'email field is required').notEmpty();
                req.assert('phone_number', 'phone_number field is required').notEmpty();
                req.assert('username', 'username field is required').notEmpty();
                req.assert('email', 'valid email is required').isEmail();
                req.assert('phone_number', 'only number is required').isDecimal();
                req.assert('phone_number', 'length must be 10 characters').isLength({min:10});
                break;
            case 'style_signup':
                req.assert('username', 'username field is required').notEmpty();
                req.assert('email', 'email field is required').notEmpty();
                req.assert('email', 'valid email is required').isEmail();
                req.assert('phone_number', 'phone_number field is required').notEmpty();
                req.assert('phone_number', 'only number is required').isDecimal();
                req.assert('phone_number', 'length must be 10 characters').isLength({min:10});
                req.assert('country_code', 'country_code field is required').notEmpty();
                req.assert('password', 'password field is required').notEmpty();
                req.assert('password', 'password length must be 8 characters').isLength({min:8});
                req.assert('longitude', 'longitude field is required').notEmpty();
                req.assert('latitude', 'latitude field is required').notEmpty();
                req.assert('device_token', 'device_token field is required').notEmpty();
                req.assert('device_type', 'device_type field is required').notEmpty();
                req.assert('security_key', 'security_key field is required').notEmpty();
                req.assert('country', 'country field is required').notEmpty();
                req.assert('state', 'state field is required').notEmpty();
                req.assert('service', 'service field is required').notEmpty();
                req.assert('province', 'province field is required').notEmpty();
                break;
            case 'stylist_social_login':
                req.assert('email', 'email field is required').notEmpty();
                req.assert('email', 'valid email is required').isEmail();
                req.assert('password', 'password field is required').notEmpty();
                req.assert('password', 'password length must be 8 characters').isLength({min:8});
                req.assert('device_token', 'device_token field is required').notEmpty();
                req.assert('device_type', 'device_type field is required').notEmpty();
                req.assert('security_key', 'security_key field is required').notEmpty();  
                req.assert('longitude', 'longitude field is required').notEmpty();
                req.assert('latitude', 'latitude field is required').notEmpty();  
                req.assert('social_id', 'social_id field is required').notEmpty();  
                req.assert('social_type', 'social_type field is required').notEmpty();  
                req.assert('location', 'location field is required').notEmpty();  
                req.assert('state', 'state field is required').notEmpty();  
                req.assert('service', 'service field is required').notEmpty();  
                req.assert('province', 'province field is required').notEmpty();  
                break;
            case 'get_all_service':
            	req.assert('security_key', 'security_key field is required').notEmpty();  
            	break;
            case 'forgot_password':
            	req.assert('security_key', 'security_key field is required').notEmpty();  
            	req.assert('email', 'email field is required').notEmpty();  
            	req.assert('email', 'valid email is required').isEmail();
            	break;
            case 'stylist_booking':
                req.assert('security_key', 'security_key field is required').notEmpty();  
                req.assert('auth_key', 'auth_key field is required').notEmpty();  
                req.assert('stylist_id', 'stylist_id field is required').notEmpty();  
                req.assert('service_id', 'service_id field is required').notEmpty();  
                req.assert('date', 'date field is required').notEmpty();  
                req.assert('preferences', 'preferences field is required').notEmpty();  
                req.assert('time', 'time field is required').notEmpty();  
                break;
            case 'monat_business_add':
            	req.assert('security_key', 'security_key field is required').notEmpty();  
            	req.assert('auth_key', 'auth_key field is required').notEmpty();  
            	req.assert('product_name', 'product_name field is required').notEmpty();  
            	req.assert('website_link', 'website_link field is required').notEmpty();  
            	break;
            default:
                break;
        }
        var errors = req.validationErrors();
        if (errors) {
            /*let my_message='';
            for(let i=0; i<errors.length;i++){
                if(errors.length==i){
                     my_message+=errors[i].msg;
                }else if(i==0){
                   my_message+=errors[i].msg;  
                }else{
                   my_message+=", "+errors[i].msg;  
                }
               
            }*/
            var error_messages = {
                status: "error",
                message : errors
            };
            var is_error = true;
            callback(is_error, error_messages);
        }else{
            var is_error = false;
            var error_messages = {};
            callback(is_error, error_messages);
        }
    }
}