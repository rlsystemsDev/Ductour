var Helper = require('../config/helper');
var Database = require('../config/database.js');
var path = require('path');
async = require("async");
var db = '';
var Promise = require('promise');


module.exports = class healthtips_model extends Helper {

    constructor() {
        super();
        db = new Database();
    }
    async get_healthtips(is_deleted, callback) {
        try {
            let rows = '';
            const [row, field] = await db.db_connect.execute('SELECT *  FROM health_tips where is_deleted="0" order by id DESC');
            if (row != '') {
                rows = row;
            }
            callback(rows);
        } catch (err) {
            throw err;
        }
    }

    async save_healthtips(data, image, i_test = 1) {

        try {
            var _image_name = "";
            var _video_name = "";
            var _audio_name = "";
            var _thumb = "";
            if (image && image.image != '') {
                _image_name = super.new_image_Upload(image.image);
            }
            if (image && image.file != '') {
                _video_name = super.new_image_Upload(image.file);

            }
            _thumb = super.new_image_Upload(image.thumb);


            if (image && image.audio != '') {
                _audio_name = super.new_image_Upload(image.audio);
            }
            _image_name = (typeof _image_name == 'undefined') ? '' : _image_name;
            _video_name = (typeof _video_name == "undefined") ? '' : _video_name;
            _audio_name = (typeof _audio_name == 'undefined') ? '' : _audio_name;
            _thumb = (typeof _thumb == 'undefined') ? '' : _thumb;
          
        
            let final_type = '';
            if ((data.youtubeLink || data.vimeoLink || _video_name) && data.article) {

                final_type = "1";

            }else if ((data.youtubeLink || data.vimeoLink || _video_name) && data.article && _audio_name != ''){

                final_type = "1";

            }else if((data.youtubeLink || data.vimeoLink || _video_name) && _audio_name != ''){

                final_type = "1";

            }else if (_audio_name != '') {

                final_type = "4";
            }
            else if ((data.youtubeLink || data.vimeoLink || _video_name != '') && data.article=='' && _audio_name == '' ) {

                final_type = "3";
            }
            
            else if (data.article != '') {
                final_type = "2";
            }


            // console.log(final_type, 'gggggggggggggggggggggggggggggggggggggggggggg');
            // console.log(_thumb, '_thumb');
            // console.log(_video_name, '_video_name');
            const [SaveHealthtips] = await db.db_connect.execute('insert into health_tips set title=?,description=?,article=?,youtube_link=?,vimeo_link=?,video=?,audio=?,image=?,thumb=?,type=?,status=?,created=?,modified=?', [data.title, data.description, data.article, data.youtubeLink, data.vimeoLink, _video_name, _audio_name, _image_name, _thumb, final_type, '0', '0', '0']);
            //console.log(SaveHealthtips, 'save from model');
            return SaveHealthtips;
        } catch (err) {
            throw err;
        }
    }

    async get_healthtips_data(data) {
        try {
            const [row] = await db.db_connect.execute('select * from health_tips where id=?', [data]);
            if (row != '') {
                return row;
            } else {
                return false;
            }
        } catch (err) {
            throw err;
        }
    }

    async update_healthtips(data, image) {

        try {
            var _image_name = "";
            var _video_name = "";
            var _audio_name = "";
            if (image && image.image != '') {
                _image_name = super.new_image_Upload(image.image);
            }
            if (image && image.file != '') {
                _video_name = super.new_image_Upload(image.file);
            }

            if (image && image.audio != '') {
                _audio_name = super.new_image_Upload(image.audio);
            }

            _image_name = (typeof _image_name == 'undefined') ? '' : _image_name;
            _video_name = (typeof _video_name == "undefined") ? '' : _video_name;
            _audio_name = (typeof _audio_name == 'undefined') ? '' : _audio_name;

            let final_type = '';

            // if ((data.youtubeLink || data.vimeoLink || _video_name) && data.article && _audio_name != '') {
            //     final_type = "1";
            // }
            // else 
           // console.log(data.article=='',"==============>>");return;
            if (_audio_name != '') {

                final_type = "4";
            }
            else if (data.youtubeLink || data.vimeoLink || _video_name != '' && data.article=='' && _audio_name=='' ) {
                final_type = "3";
            }

            else if (data.article != '') {

                final_type = "2";
            }else{
                final_type = "1";
            }

            const [UpdateHealthtips] = await db.db_connect.execute('update  health_tips set image=?,title=?,description=?,article=?,youtube_link=?,vimeo_link=?,video=?,audio=?,type=? where id=?', [_image_name, data.title, data.description, data.article, data.youtubeLink, data.vimeoLink, _video_name, _audio_name, final_type, data.user_id]);
            console.log(UpdateHealthtips, 'from model');

            return UpdateHealthtips;
            /* }else{
                return false;
            }  */
        } catch (err) {
            throw err;
        }
    }
    async get_healtips_details(data) {
        try {
            let final_data = ''
            //if(type==1){
            if(data.type ==1){
                console.log('select * from health_tips where is_deleted=? order by id desc ',[0]);
                const [Result] = await db.db_connect.execute('select * from health_tips where is_deleted=? order by id desc ',[0]);
                console.log(Result.length,"=========total healthtips all");
                final_data = Result; 
            }else if(data.type == 2){
                const [Result] = await db.db_connect.execute('select * from health_tips where type=2  and is_deleted=? order by id desc', [data.type,0]);
                console.log(Result.length,"=========total healthtips all");
                final_data = Result;

            }else if(data.type == 3){
                console.log('select * from health_tips where video!="" || vimeo_link!="" || youtube_link!=""   and is_deleted=? order by id desc');
                const [Result] = await db.db_connect.execute('select * from health_tips where type=3 and is_deleted=0 order by id desc');
                console.log(Result.length,"=========total healthtips all");
                final_data = Result;

            }else if(data.type == 4){
               
                const [Result] = await db.db_connect.execute('select * from health_tips where type=4 and is_deleted="0" order by id desc');
                console.log(Result.length,"=========total healthtips all");
                final_data = Result;

            }
       
            return final_data;
        } catch (err) {
            throw err;
        }
    }
}