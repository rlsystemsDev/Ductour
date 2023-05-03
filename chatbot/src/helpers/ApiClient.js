import React from 'react';
import axios from 'axios';
const baseUrl ="https://api.infermedica.com/v2/";
var headers = { 'App-Id': '5e95d85e', 'App-Key': '6aef7488e89e85f81211eba27d092ae1', 'model':'infermedica-en'};
const Api = async function (endpoint, method, params) {
    var fullUrl = baseUrl + endpoint;
    
    if (method == 'get' || method == 'GET') {
        const resp = await axios.get(fullUrl, {
            headers: headers
        }).then(function (response) {
            if(response.data){
                return { data: response.data, status: response.status };
            }
            else if(response.body){
                return { data: response.body, status: response.status };
            }
            else{
                return { data: response, status: response.status };
            }
            
        }).catch(async function (error) {
            if (error.response) {

                if (error.response.status == 401) {
                    return false;
                }
                else {
                    return { data: error.response.data, status: error.response.status };
                }
            }
        });

        return resp;
    }
    else {

        const resp = await axios.post(fullUrl, params, {
            headers: headers
        }).then(function (response) {
            return { data: response.data, status: response.status };
        }).catch(async function (error) {
            if (error.response) {
                if (error.response.status == 401) {
                    return false;
                }
                else {
                    return { data: error.response.data, status: error.response.status };
                }
            }
        });

        return resp;
    }
};

export default Api