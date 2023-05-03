var Helper = require('../config/helper');
var  Database = require('../config/database.js');
var path = require('path');
async = require("async");
var db = '';
var Promise = require('promise');


module.exports = class contents_model extends Helper{

    constructor(){
        super();
        db = new Database();
    }
    async get_contents(is_deleted,callback){
    try{
        const[row, field] = await db.db_connect.execute('SELECT * from contents where type="1"');
        callback(row);
    }catch(err){
        throw err;
    }
 }
 async updateTerms(data){
     try{
        const[datas]= await db.db_connect.execute('update contents set content=? where type=?',[data.privacy,data.type]);
        if(datas!=''){
            return 1;
        }else{
            return 0;
        }

     }catch(err){
         throw err;
     }
 }
 async get_about(data){
    try{
        const[row, field] = await db.db_connect.execute('SELECT * from contents where type="2"');
       return row
    }catch(err){
        throw err;
    }
 }
 async updateAbout(data){
    try{
       const[datas]= await db.db_connect.execute('update contents set content=? where type=?',[data.privacy,data.type]);
       console.log(datas,"=================aboutus");
       if(datas!=''){
           return 1;
       }else{
           return 0;
       }

    }catch(err){
        throw err;
    }
}
async findAllFaqs(){
    try{
        const[rows]= await db.db_connect.execute('select * from faq where type=1');
        return rows;
    }catch(err){
        throw err;
    }
}
async findAllFaqsHospital(){
    try{
        const[rows]= await db.db_connect.execute('select * from faq where type=2');
        console.log(rows,"=====================rows");
        return rows;
    }catch(err){
        throw err;
    }
}
async get_faqs(data){
    try{
        const[getdata]= await db.db_connect.execute('select * from faq where id="'+data+'"');
       return getdata;
    }catch(err){
        throw err;
    }
}
async updatingdata(data){
    try{
       
        const[datas]= await db.db_connect.execute('update faq set title=?,content=? where id=?',[data.tile,data.content,data.id]);
        
        if(data!=''){
            return 1;
        }else{
            return 0;
        }
    }catch(err){
        throw err;
    }
}
async updatingdataHospital(data){
    try{
        const[datas]= await db.db_connect.execute('update faq set title=?,content=? where id=?',[data.tile,data.content,data.id]);
        
        if(data!=''){
            return 1;
        }else{
            return 0;
        }
    }catch(err){
        throw err;
    }
}
async getPrivacy(data){
    try{
        const[getdata]= await db.db_connect.execute('select * from contents where type=?',[2]);
       return getdata;
    }catch(err){
        throw err;
    }
}
async getTerms(data){
    try{
        const[getdata]= await db.db_connect.execute('select * from contents where type=?',[1]);
       return getdata;
    }catch(err){
        throw err;
    }
}
async savefaqs(data){
    try{
        const[savingfaqs]= await db.db_connect.execute('insert into faq set title=?,content=?,type=1',[data.tile,data.content]);
        if(savingfaqs){
            return 1
        }
    }catch(err){
        throw err;
    }
}
async savefaqsHospital(data){
    try{
        const[savingfaqs]= await db.db_connect.execute('insert into faq set title=?,content=?,type=2',[data.tile,data.content]);
        if(savingfaqs){
            return 1
        }
    }catch(err){
        throw err;
    }
}
 async get_cookie(is_deleted,callback){
    try{
        const[row, field] = await db.db_connect.execute('SELECT * from contents where type="4"');
        callback(row);
    }catch(err){
        throw err;
    }
 }
 async updatecookie(data){
     try{
        const[datas]= await db.db_connect.execute('update contents set content=? where type=?',[data.privacy,data.type]);
        if(datas!=''){
            return 1;
        }else{
            return 0;
        }

     }catch(err){
         throw err;
     }
 }
}
