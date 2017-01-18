/**
 * Created by zhekexinxi on 2017/1/17.
 */
var Photo = require("../models/Photo");
var path = require('path');
var fs = require('fs');
var join = path.join;


exports.list = function(dir){
    return function(req, res, next){
        Photo.loadOrInitializeTaskArray(dir + '/photolist.txt',function(photos){
            res.render('photos', {
                title: 'Photos',
                photos: photos
            });
        });
    };
};


exports.forms = function(req, res){
    res.render('photos/upload', {
        title: 'Photo upload'
    });
};

exports.submits = function (dir) {
    return function(req, res, next){
        var img = req.files.photo.image;
        var name = req.body.photo.name || img.name;
        var path = join(dir, img.name);
        fs.rename(img.path, path, function(err){
            if (err) return next(err);
            var photo = {name:name,path:img.name,id:uuid()};
            Photo.addTask(dir+'/photolist.txt',photo);
            res.redirect('/photos');
        });
    };
};

exports.download = function(dir){
    return function(req, res, next){
        var id = req.params.id;
        Photo.loadOrInitializeTaskArray(dir + '/photolist.txt', function(photos) {
            for(var index in photos){
                var photo = photos[index];
                if(id == photo.id){
                    var path = join(dir, photo.path);
                    res.download(path, photo.name+'.jpeg');
                }
            }
        });
    };
};




