var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/items';

var datas=[];
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var query = { address: /^L/ };
  db.collection("eatables").find(query).toArray(function(err, result) {
    if (err) throw err;
    datas=result;
    console.log(datas);
    return data;
    db.close();
  });
});

console.log("hello");
console.log(datas);