var mongo = require('mongodb');

var Server = mongo.Server,
        Db = mongo.Db,
        BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('items', server);


db.open(function(err, db) {
    if (!err) {
        console.log("Connected to 'mydb' database");
        db.collection('eatables', {strict: true}, function(err, collection) {
            if (err) {
                console.log("error");
            }
        });
    }
});


exports.find = function(req, res) {
var b=req.params.search;
var category = req.params.categ;
db.collection(category, function(err, collection) {
      collection.find({item_name: new RegExp('^' + b)}).toArray(function(err, items) {
                console.log(items);
                res.jsonp(items);
            });
        });
};
