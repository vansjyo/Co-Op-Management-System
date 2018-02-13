// In this controller we'd be setting up routing and some other basic functionalities of our app.
var mongoose= require('mongoose');

// Importing body-parser
var bodyParser = require('body-parser');

//Setting up initial dummy data
var data = [{item: "Get milk",quantity:2}, {item: "Walk dog",quantity:1}, {item: "Eat dinner",quantity:2}];
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/items';


// This functions returns to the call in app.js or rather it exports to the line of code where it is required in app.js
module.exports = function(app){

    // Setting up routes
    


    app.get('/eat-chips',  isLoggedIn, (req, res) => {
        var mychips= [];
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var query = { category: "chips" };
          db.collection("eatables").find(query).toArray(function(err, result) {
            if (err) throw err;
            mychips= result;
            res.render('eat-chips', {todos: data, chips : mychips });
            console.log(mychips);
        });
      });
    });

     app.get('/eat-chips', isLoggedIn, (req, res) => {
        res.render('eat-chips', {todos: data});
    });


    // When user submits a form
    app.post('/todo', isLoggedIn, urlencodedParser, (req, res) => {
        // Adding the items to the top of the list instead :P
        var exist = data.filter(x => x.item == req.body.item);
        console.log("im here dude");
        if( exist.length == 0){
            data.unshift(req.body);
            res.json(data);
        }
        else{
            req.body.quantity = ++exist[0].quantity;
            var idx = data.indexOf(exist[0]);
            if (idx != -1) data.splice(idx, 1);
            data.unshift(req.body);
            res.json(data);
        }
        // res.render('todo', {todos: data});
    });


    app.get('/todo', isLoggedIn , (req,res) => {
        res.render('todo', {todos: data, user: req.user });
    });


    // For when a user sends a delete request
    app.delete('/todo/:item/:quantity', (req, res) => {
        data = data.filter(todo => {
            // For some insecure reasons I just had to convert everything to lowercase
            return todo.item.toLowerCase().replace(/ /g, '-') !== req.params.item.toLowerCase();
        });
        res.json(data);
    });

};




function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
}