var mongo = require('mongodb');

var Server = require('mongodb').Server;
var Db = mongo.Db;
var BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('userdb', new Server('localhost', 27017));

db.open(function(err, db) {
    if (!err) {
        console.log("Connected to 'mydb' database");
        db.collection('items', {strict: true}, function(err, collection) {
            if (err) {
                console.log("error");
            }
        });
    }
});


exports.find = function(req, res) {
var b=req.params.search;
var category = req.params.categ;
if(category!=="all"){
db.collection('items', function(err, collection) {
      collection.find({item_name: new RegExp('^' + b) ,item_category: category, item_enable :1}).toArray(function(err, items) {
                console.log(items);
                res.jsonp(items);
            });
        });
}
else{
    db.collection('items', function(err, collection) {
      collection.find({item_name: new RegExp('^' + b),  item_enable :1}).toArray(function(err, items) {
                console.log(items);
                res.jsonp(items);
            });
        });

}
};
