var User = require('./models/user');
var flash = require('express-flash');
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var url2 = 'mongodb://localhost:27017/orders'
var url = 'mongodb://localhost:27017/items';
var data = [{ no: "re54e4e65", item:"safola_oil(remove by clicking on me)", quantity:2, price: 45}];
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var express= require('express');
const SendOtp = require('sendotp');
var autocomplete=require('../app/autocomplete.js');
var app= express();


module.exports = function(app, passport){

    app.get('/autocomplete/:search/:categ',autocomplete.find);

    app.get('/', function(req, res){
      res.render('index.ejs');
  });


    app.get('/login', function(req, res){
      res.render('login.ejs', { message: req.flash('loginMessage') });
  });

    app.get('/contact', function(req, res){
        res.render('contact.ejs');
    });


    app.post('/login', passport.authenticate('local-login', {
      successRedirect: '/home',
      failureRedirect: '/login',
      failureFlash: true
  }));


    app.get('/signup', function(req, res){
      res.render('signup.ejs', { message: req.flash('signupMessage') });
  });


    app.post('/signup', passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/signup',
      failureFlash: true
  }));


    app.get('/home', isLoggedIn, function(req, res){
        if(req.user.local.admin == false)
          res.render('home.ejs', { user: req.user });
      else
        res.render('admin.ejs',{ user: req.user });
});


    app.get('/profile', isLoggedIn, function(req, res){
        res.render('profile.ejs', { user: req.user });
    });


    app.get('/additem', isLoggedIn, function(req, res){
        res.render('additem.ejs', { user: req.user });
    });


    app.get('/admin', isLoggedIn, function(req, res){
        res.render('admin.ejs', { user: req.user });
    });



    app.get('/categories', isLoggedIn, function(req, res){
      res.render('categories.ejs', { user: req.user });
  });


    app.get('/forgot', function(req, res) {
      res.render('forgot', { user: req.user });
  });


    app.post('/login', passport.authenticate('local-login', {
      successRedirect: '/home',
      failureRedirect: '/login',
      failureFlash: true
  }));


    app.post('/additem', isLoggedIn, function(req, res){
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var myobj = { item_name: req.body.itemname,
            item_no :req.body.itemno,
            item_price: req.body.itemprice,
            item_quantity: req.body.itemleft,
            item_category: req.body.itemcategory};
            var collection= req.body.itemcollection;
            db.collection(collection).insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
            });
        }); 
        req.flash('info', 'Item has been successfully added to the database');
        res.render('additem');
        
    });

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

    app.get('/eat-chocolates',  isLoggedIn, (req, res) => {
      var mychocolates= [];
      MongoClient.connect(url, function(err, db) {
       if (err) throw err;
       var query = { category: "chocolate" };
       db.collection("eatables").find(query).toArray(function(err, result) {
        if (err) throw err;
        mychocolates= result;
        res.render('eat-chocolates', {todos: data, chocolates : mychocolates });
        console.log(mychocolates);
    });
   });
  });

   ////create more like this(/body_productlist, /stationarylist , /forSalelist , /dometic_productlist)
    app.get('/eatablelist',  isLoggedIn, (req, res) => {
      var items= [];
      MongoClient.connect(url, function(err, db) {
       if (err) throw err;
       db.collection("eatables").find({}).toArray(function(err, result) {
        if (err) throw err;
        items= result;
        res.render('eatablelist', {eatables : items });
    });
   });
  });





    app.get('/eat-chocolates', isLoggedIn, (req, res) => {
      res.render('eat-chocolates', {todos: data});
  });

    app.get('/eat-chips', isLoggedIn, (req, res) => {
      res.render('eat-chips', {todos: data});
  });


    app.post('/todo', isLoggedIn, urlencodedParser, (req, res) => {
        // Adding the items to the top of the list instead :P
        var exist = data.filter(x => x.item == req.body.item);
        if(exist.length == 0){
        	if(req.body.quantity>=1){
        		req.body.quantity=1;
        		data.unshift(req.body);
                req.flash('info', 'Item has beeen added to the cart');
                res.json(data);}
            }
            else{
              if(req.body.quantity>exist[0].quantity){
                 req.body.quantity = ++exist[0].quantity;
                 var idx = data.indexOf(exist[0]);
                 if (idx != -1) data.splice(idx, 1);
                 data.unshift(req.body);
                 req.flash('info', 'Item has beeen added to the cart');
                 res.json(data);}
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




    app.post('/forgot', function(req, res, next) {
    	async.waterfall([
    		function(done) {
    			crypto.randomBytes(20, function(err, buf) {
    				var token = buf.toString('hex');
    				done(err, token);
    			});
    		},
    		function(token, done) {
    			User.findOne({ 'local.email' : req.body.email }, function(err, user) {
    				console.log(token);
    				if (!user) {
    					req.flash('error', 'No account with that email address exists.');
    					console.log("email dosnt exists" + req.body.email);
    					return res.redirect('/forgot');
    				}
    				user.local.resetPasswordToken = token;
                    user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                    user.save(function(err) {
                    	done(err, token, user);
                    });
                });
    		},
    		function(token, user, done) {
    			var transporter = nodemailer.createTransport( {
    				service: 'gmail',
    				auth: {
    					user: 'samplemailernitk@gmail.com',
    					pass: '1234abcd!@#$'
    				}
    			}); 
    			var mailOptions = {
    				to: user.local.email,
    				from: 'samplemailernitk@gmail.com',
    				subject: 'Node.js Password Reset',
    				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
    				'Please click on the following link to complete the process:\n\n' + 'http://' + req.headers.host + '/reset/' + token + '\n\n' +
    				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    			};

    			transporter.sendMail(mailOptions, function(err, info) {
    				console.log("email has been sent");
    				req.flash('info', 'An e-mail has been sent to ' + user.local.email + ' with further instructions.');
    				done(err, 'done');
    			});
    		}
    		], function(err) {
    			if (err) return next(err);
    			res.redirect('/forgot');
    		});
    });



    app.get('/reset/:token', function(req, res) {
    	User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires': { $gt: Date.now() } }, function(err, user) {
    		if (!user) {
    			req.flash('error', 'Password reset token is invalid or has expired.');
    			console.log("password reset token is innvalid");
    			return res.redirect('/forgot');
    		}
    		res.render('reset', {
    			user: req.user
    		});
    	});
    });


    app.get('/confirm/:token', function(req, res, done) {                                                                        
        User.findOne({ 'local.emailConfirmToken': req.params.token, 'local.emailConfirmExpires': { $gt: Date.now() } }, function(err, user) {
            if (!user) {
                req.flash('error', 'confirmtaion token is invalid or has expired.');
                console.log("email confirmtaion token is invalid");
                return res.redirect('/login');
            }


            user.local.emailConfirmToken=undefined,
            user.local.emailConfirmExpires=undefined,

            user.save(function(err) {
                if(err)
                    return done(err);
                req.flash('success','email has been confired. now you may log in.');
                return done(null); 
            });

            res.render('login');
        });
    });


    app.post('/reset/:token', function(req, res) {
    	async.waterfall([
    		function(done) {
    			User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires' : { $gt: Date.now() } }, function(err, user) {
    				if (!user) {
    					req.flash('error', 'Password reset token is invalid or has expired.');
    					console.log("niklo yahan se");
    					return res.redirect('back');
    				}

    				user.local.password = user.generateHash(req.body.password);
    				user.local.resetPasswordToken = undefined;
    				user.local.resetPasswordExpires = undefined;

    				user.save(function(err) {
    					if(err)
    						return done(err);
    					req.flash('success', 'Success! Your password has been changed.');
    					return done(null, user);
    				});
    			});
    		},
    		function(user, done) {
    			var transporter = nodemailer.createTransport( {
    				service: 'google',
    				auth: {
    					user: 'samplemailernitk@gmail.com',
    					pas: '1234abcd!@#$'
    				}
    			});
    			var mailOptions = {
    				to: user.local.email,
    				from: 'samplemailernitk@gmail.com',
    				subject: 'Your password has been changed',
    				text: 'Hello,\n\n' +
    				'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
    			};
    			transporter.sendMail(mailOptions, function(err,info) {
    				req.flash('info', 'Success! Your password has been changed.');
    				done(err,'done');
    			});
    		}
    		], function(err) {
    			res.redirect('/');
    		});
    });








    app.get('/enterOTP', isLoggedIn, function(req, res, next) {
    	async.waterfall([
    		function(done) {
    			var token = Math.floor(1000 + Math.random() * 9000);
    			token = token.toString();
    			token = token.substring(-2);
    			done(null, token);
    		},
    		function(token , done) {
    			console.log(token);


    			var invalid_item = data.filter(x => x.item =="safola_oil(remove by clicking on me)");
    			if(invalid_item.length==1){
    				req.flash('error', 'please remove the sample item and then place order');
    				return res.redirect('/todo');
    			}



    			console.log(req.user.local.telephone);
    			var user = req.user;

    			user.local.orderOTP = token;
                    user.local.orderOTPExpires = Date.now() + 90000; // 1 hour

                    user.save(function(err) {
                    	done(err, token, user);
                    });

                },
                function(token, user, done) {
                	const sendOtp = new SendOtp('187833AUFFaxWQm5a2ff60c');
                sendOtp.setOtpExpiry('2'); //in minutes
                sendOtp.send(user.local.telephone,"PRIIND", token , function (error, data, response) {
                	req.flash('info', 'An otp has been sent to ' + user.local.telephone + '.  Please enter for successful placing of order');
                	console.log(data);
                	done(null ,'done');
                });
            }
            ], function(err,result) {
            	res.render('enterOTP.ejs',{todos:data});
            });
    });




    app.post('/enterOTP', isLoggedIn ,function(req, res) {
    	async.waterfall([
    		function(done) {
    			User.findOne({ 'local.orderOTP': req.body.OTP , 'local.orderOTPExpires' : { $gt: Date.now() } }, function(err, user) {
    				if (!user) {
    					req.flash('error', 'order OTP is invalid or has expired.');
    					return res.redirect('/todo');
    				}

    				user.local.orderOTP = undefined;
    				user.local.orderOTPExpires = undefined;

    				data.forEach(x => {
    					user.local.orderList.unshift({
    						item_no: x.no ,
    						item_name: x.item , 
    						item_quantity: x.quantity ,
    						item_price: x.price
    					}); 
    				});

    				user.save(function(err) {
    					if(err)
    						return done(err);
    					req.flash('success', 'Your order has been placed');
    					return done(null, user);
    				});
    			});
    		},
    		function(user,done){
    			console.log(req.user.local.telephone);
    			console.log(data);
    			var myobj = {
    				firstname: req.user.local.firstname,
    				lastname: req.user.local.lastname ,
    				telephone: req.user.local.telephone,
    				address: req.body.address,
    				orderList: data
    			};
    			console.log("my problem");
    			MongoClient.connect(url2, function(err, db) {
    				if (err){throw err;} 
    				db.collection("order").insertOne(myobj, function(err, res) {
    					if (err) throw err;
    					console.log("1 document inserted");
    					db.close();
    				});
    			});
    			console.log("heyme");
    			done(null,'done');
    		}
    		], function(err,result) {
    			console.log("im done");
    			data=[{ no: "re54e4e65", item:"safola_oil(remove by clicking on me)", quantity:2, price: 45}];
    			res.redirect('/todo');
    		});

    });


    app.post('/profile', function(req, res, next) {
        async.waterfall([
            function(done) {
                var user = req.user;
                user.local.firstname = req.body.firstname;
                user.local.lastname = req.body.lastname;
                user.local.telephone = req.body.telephone;


                user.save(function(err) {
                    done(err, user);
                });


            }
            ], function(err) {
                if (err) return next(err);
                res.redirect('/profile');
            });
    });



    app.get('/logout', function(req, res){
    	req.logout();
    	res.redirect('/');
    });
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}