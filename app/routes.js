var User = require('./models/user');
var Items = require('./models/items');
var Sale_Items = require('./models/sale_items');
var Orders = require('./models/orders');
var flash = require('express-flash');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var url2 = 'mongodb://localhost:27017/orders'
var async = require('async');
var crypto = require('crypto');
var fs = require('fs');
var path = require('path');
var busboy = require('connect-busboy');
var nodemailer = require('nodemailer');
var express= require('express');
const SendOtp = require('sendotp');
var autocomplete=require('../app/autocomplete.js');
var formidable = require('formidable');
var fs = require('fs');
var series = require('run-series')
var app= express();


module.exports = function(app, passport){


//#1
app.get('/autocomplete/:search/:categ',autocomplete.find);

//#2
app.get('/', function(req, res){
  res.render('index.ejs');
});

//#3
app.get('/login', function(req, res){
  if(req.user== undefined){
    res.render('login.ejs', { message: req.flash('loginMessage') });}
    else {res.render('home.ejs');}
  });

//#4
app.get('/contact', function(req, res){
 res.render('contact.ejs');
});

//#5
app.get('/signup', function(req, res){
  res.render('signup.ejs', { message: req.flash('signupMessage') });
});


app.get('/home',isLoggedIn, function(req, res){
  if(req.user.local.admin == "owner")
    res.render('admin.ejs');
  else if(req.user.local.admin == "staff")
    res.render('staff.ejs');
  else{
    res.render('home.ejs');
  }

});


//#6
/*app.get('/home', isLoggedIn, function(req, res){
  if(req.user.local.admin == "owner")
    res.render('admin.ejs', { user: req.user });
  else if(req.user.local.admin == "staff")
    res.render('staff.ejs',{ user: req.user });
  else
    res.render('home.ejs',{ user: req.user });
});
*/

//#7
app.get('/profile', isLoggedIn, function(req, res){
  res.render('profile.ejs', { user: req.user});
});

//#8
app.get('/additem', isLoggedIn, function(req, res){
  res.render('additem.ejs', { user: req.user });
});

//#9
app.get('/admin', isLoggedIn, function(req, res){
  if(req.user.local.admin == "owner"){
    res.render('admin.ejs', { user: req.user });}
    else res.end();
  });


//#10
app.get('/categories', isLoggedIn, function(req, res){
  res.render('categories.ejs', { user: req.user });
});

//#11
app.get('/forgot', function(req, res){
  res.render('forgot.ejs');
});

app.get('/enterOTP', function(req, res) {
  res.render('enterOTP.ejs');
});


//#12
app.get('/eat-chips',  isLoggedIn, (req, res) => {
  var mychips= [];
  var query = { item_category: "chips" };
  Items.find(query, function(err, result) {
   if (err) throw err;
   mychips= result;
   res.render('eat-chips', { chips : mychips });
 });
});


//#13
app.get('/eat-chocolates',  isLoggedIn, (req, res) => {
  var mychocolates= [];
  var query = { item_category: "chocolate" };
  Items.find(query,function(err, result) {
   if (err) throw err;
   mychocolates= result;
   res.render('eat-chocolates', {chocolates : mychocolates });
 });
});

//#14
////create more like this(/body_productlist, /stationarylist , /forSalelist , /dometic_productlist)
app.get('/itemslist',  isLoggedIn, (req, res) => {
  if(req.user.local.admin == "owner" || "staff"){
    var items= [];
    Items.find({},function(err, result) {
     if (err) throw err;
     items = result;
     res.render('itemslist', {items: items });
   });
  }
  else res.end();
});

//#15
app.get('/eat-chocolates', isLoggedIn, (req, res) => {
  res.render('eat-chocolates');
});

//#16
app.get('/eat-chips', isLoggedIn, (req, res) => {
  res.render('eat-chips');
});


//#17
app.get('/todo', isLoggedIn , (req,res) => {
  res.render('todo', { user: req.user });
});

//#18
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

//#19
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


//#20
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//#21
app.get('/placeorder', isLoggedIn, (req,res) =>{
  function getorder(cart , done) {
    var enable=1;
    var amount=0;
   
    var iteratorFcn = function(cart, done) {
      Items.findOne({ item_no : cart.no }, function(err, result){
        console.log(result);
        if(err) {
          done(err);
          return;
        }
        if(result == null){
          return done(null,false,req.flash('info', "all items now not available"));
        }
        if( result.item_quantity-result.item_sales >= cart.quantity ){
          cart.status = "available";
          cart.item = result.item_name;
          cart.price = result.item_price;
        }
        else{
          enable = 0;
          var avail=result.item_quantity-result.item_sales;
          cart.status = "only " + avail + " available";
        }
        // req.user.save(function(err){
        //   if(err) throw err;
        // });
        done(null , enable);
      });
    };

    var doneIteratingFcn = function(err) {
      if(err) throw err;
      if(enable == 1){
        req.user.local.todo.forEach(x => {
          amount += x.price*x.quantity;
        });
        req.user.local.todo.forEach(x => {
          x.amount = amount;
        });
      }
      if(enable == 0){
        req.user.local.todo.forEach(x => {
          x.amount = 0;
        });
        req.user.save(function(err){
          if(err) throw err;});
        return done(null,false,req.flash('info', "all items not available"));
      }
      req.user.local.cart_enable = 1;
      done(null);
      
    };
    // iteratorFcn will be called for each element in cart.
    async.forEach( cart , iteratorFcn, doneIteratingFcn);
  }
  getorder(req.user.local.todo , function(err) {
    if(err) {
      throw err;
      return;
    }
    req.user.save(function(err){
      if(err) throw err;
    })
    res.render('placeorder.ejs', {user:req.user});
  });
});

//#22
app.get('/orderslist',  isLoggedIn, (req, res) => {
  if(req.user.local.admin == "owner" || "staff"){
    var orders= [];
    Orders.find({},function(err, result) {
     if (err) throw err;
     orders = result;
     res.render('orderslist.ejs', { orders: orders });
   });
  }
  else res.end();
});


//#22
app.get('/addstaff', isLoggedIn, function(req, res){
  if(req.user.local.admin == "owner"){
    res.render('addstaff.ejs', { user: req.user });}
    else res.end();
  });

//#23
app.get('/saleslist',  isLoggedIn, (req, res) => {
  if(req.user.local.admin == "owner"){
    var items= [];
    Items.find({},function(err, result) {
     if (err) throw err;
     items = result;
     res.render('saleslist', {items: items });
   });
  }
  else res.end();
});

//#24
app.get('/deleteitem',  isLoggedIn, (req, res) => {
  if(req.user.local.admin == "owner"){
   res.render('deleteitem', {user : req.user});
 }
 else res.end();
});

//#25
app.get('/confirm_deleteitem',  isLoggedIn, (req, res) => {
  if(req.user.local.admin == "owner"){
   res.render('confirm_deleteitem', {user : req.user});
 }
 else res.end();
});

//#26
app.get('/stafflist',  isLoggedIn, (req, res) => {
  if(req.user.local.admin == "owner"){
    var staff= [];
    User.find({ 'local.admin' :"staff"},function(err, result) {
     if (err) throw err;
     staff = result;
     res.render('stafflist', { staff : staff });
   });
  }
  else res.end();
});

//#27
app.get('/deletestaff',  isLoggedIn, (req, res) => {
  if(req.user.local.admin == "owner"){
   res.render('deletestaff', {user : req.user});
 }
 else res.end();
});

//#28
app.get('/adminprofile', isLoggedIn, function(req, res){
  if(req.user.local.admin == "owner"){
    res.render('adminprofile.ejs', { user: req.user });}
    else res.end();
  });

//#29
app.get('/for_sale_upload', isLoggedIn, function(req, res){
  res.render('for_sale_upload.ejs', { user: req.user });
});

//#30
app.get('/team', isLoggedIn, function(req, res){
  res.render('team.ejs', { user: req.user });
});

//#31
app.get('/settings', isLoggedIn, function(req, res){
  res.render('settings.ejs', { user: req.user });
});

//#32
app.get('/delete_account', isLoggedIn, function(req, res){
  res.render('delete_account.ejs', { user: req.user });
});

//#33
app.get('/sale_items',  isLoggedIn, (req, res) => {
  var items= [];
  Sale_Items.find({},function(err, result) {
   if (err) throw err;
   items = result;
   res.render('sale_items', { sale: items });
 });
});

//#33
app.get('/track_order', isLoggedIn, function(req, res){
  myorders = [];
  Orders.find({ email : req.user.local.email, status : { $in: [ 'order placed', 'dispatched' ] } }, function(err ,result){
    if(err) throw err;
    if(result == null){
      req.flash('u dont have any orders currently');
      res.render('error.ejs');
    }
    else{
      myorders = result;
      res.render('track_order.ejs', { user: req.user , myorders : myorders });
    }
  });
});

//#34
app.get('/sharad', function(req, res){
  scholar.profile('OHWQMuIAAAAJ')
  .then(resultsObj => {
    var a = resultsObj;
    console.log(a.results.length);
    console.log(a.results[1]);
    console.log(resultsObj);
     res.render('sharad.ejs',{data : resultsObj.results});
     
  })
  // scholar.profile('OHWQMuIAAAAJ')
  // .then(resultsObj => {
  //   console.log(resultsObj)
  //   res.render('sharad.ejs',{data : resultsObj})
  // })
  
});



//#1*
app.post('/deleteitem', isLoggedIn, function(req, res){
  var del_item_no = req.body.itemno;
  Items.findOne({ item_no: del_item_no },function(err,result){
    var del_item;
    console.log(result);
    if(err) throw err;
    if(result == null){
      req.flash('error', 'no item with this item No. exists in the database');
      res.redirect('/deleteitem');
    }
    else{
      res.render('confirm_deleteitem',{user : req.user, del_item : result });}
    });
});



//#2*
app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));


//#3*
app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

//#4*
app.post('/additem', isLoggedIn, function(req, res){
  var item = new Items({
    item_name: req.body.itemname,
    item_no :req.body.itemno,
    item_price: req.body.itemprice,
    item_quantity: req.body.itemleft,
    item_category: req.body.itemcategory});
  item.save(function(err){
    if ( err ) throw err;
    console.log("item added Saved Successfully");
  });
  req.flash('info', 'Item has been successfully added to the database');
  res.render('additem');

});


//#5*
app.post('/todo', isLoggedIn, urlencodedParser, (req, res) => {
    // Adding the items to the top of the list instead :P
//items.findOne({item_no:req.body.no},function(err,result){)
  var list = req.user.local.todo;
  var exist = list.filter(x => x.item == req.body.item);
  if(exist.length == 0){
   if(req.body.quantity>=1){
    req.body.quantity=1;
    req.user.local.todo.push(req.body);

    req.user.save(function(err) {
      if(err) throw err;
    });


          // modify the user.todo
          req.flash('info', 'Item has been added to the cart');}
        }
        else{
         if(req.body.quantity>exist[0].quantity){
           req.body.quantity = ++exist[0].quantity;
           var idx = req.user.local.todo.indexOf(exist[0]);
           if (idx != -1) req.user.local.todo.splice(idx, 1);

           req.user.local.todo.push(req.body);
           console.log(req.user.local.todo);
           req.user.save(function(err) {
            if(err) throw err;
          });
           req.flash('info', 'Item has been added to the cart');
         }
       }
       res.end() ;
    // res.render('todo', {todos: data});
  });






// For when a user sends a delete request
app.delete('/todo/:item/:quantity',  isLoggedIn, (req, res) => {
	req.user.local.todo = req.user.local.todo.filter(todo => {
        // For some insecure reasons I just had to convert everything to lowercase
        // delete from the cart
        return todo.item.toLowerCase().replace(/ /g, '-') !== req.params.item.toLowerCase();
      });

  req.user.save(function(err) {
    if(err) throw err;
  });
  res.end();
});



//#6*
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




//#7*
app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
     User.findOne({ 'local.resetPasswordToken': req.params.token, 'local.resetPasswordExpires' : { $gt: Date.now() } }, function(err, user) {
      if (!user) {
       req.flash('error', 'Password reset token is invalid or has expired.');
       return res.redirect('back');
     }

     user.local.password = user.generateHash(req.body.password);
     user.local.resetPasswordToken = undefined;
     user.local.resetPasswordExpires = undefined;

     user.save(function(err) {
       if(err)
        return done(err);
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


//#8*
app.post('/enterOTP',function(req, res , done) {
  User.findOne({ 'local.mobileOTP': req.body.OTP , 'local.mobileOTPExpires' : { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      console.log("otp invalid");
      done(null,false,req.flash('error', 'order OTP is invalid or has expired.'));
    }
    else{

      user.local.mobileOTP = undefined;
      user.local.mobileOTPExpires = undefined;

      user.save(function(err) {
        if(err)
          return done(err);
        req.flash('success', 'OTP confirmation successfull');
        done(null);

      });
    }
  });
  res.redirect('/login');
});




//10*
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



//#11*
app.post('/placeorder', isLoggedIn, (req,res) =>{
  function getorder(cart , done) {
    var enable=1;
    var amount=0;

    var iteratorFcn = function(cart, done) {
      Items.findOne({ item_no : cart.no }, function(err, result){
        if(err) {
          done(err);
          return;
        }
        if( result.item_quantity-result.item_sales >= cart.quantity ){
          cart.status = "available";
          cart.item = result.item_name;
          cart.price = result.item_price;
          console.log("im getting saved");
        }
        else{
          enable = 0;
          cart.status = "only " + result.item_quantity + " available";
        }
        console.log(cart.status);
        done(null , enable);
      });
    };

    var doneIteratingFcn = function(err) {
      if(err) throw err;
      if(enable == 1){
        req.user.local.todo.forEach(x => {
          amount += x.price*x.quantity;
        });
        req.user.local.todo.forEach(x => {
          x.amount = amount;
          x.status = "order placed";
        });
        var x= new Date();
        var rand = Math.floor((Math.random()*1000)+1).toString();
        var id= x.getHours().toString() + x.getMinutes().toString() + x.getSeconds().toString() + rand + '/'+ x.getDate().toString() + x.getMonth().toString() + x.getFullYear().toString(); 
        var order = new Orders({
          order_id : id,
          email: req.user.local.email,
          firstname: req.user.local.firstname,
          lastname: req.user.local.lastname,
          telephone: req.user.local.telephone,
          address: req.body.address,
          amount: amount,
          status:"order placed" ,
          orderList: req.user.local.todo
        });
        order.save(function(err){
          if ( err ) throw err;
          console.log("order Saved Successfully");
        });
        req.user.local.cart_enable = 1;
        req.user.local.order_id = id;
        req.flash('info','order placed successfully');
      }
      if(enable == 0){
        req.user.local.todo.forEach(x => {
          x.amount = 0;
        });


        req.user.save(function(err){
          if(err) throw err;});
        return done(null,false,req.flash('info', "all items not available"));
      }
      req.user.local.cart_enable = 1;
      done(null,'done');
    };
    // iteratorFcn will be called for each element in cart.
    async.forEach( cart , iteratorFcn, doneIteratingFcn);
  }


  function getsales(cart , done) {
    var iteratorFcn = function(cart, done) {
      Items.findOne({ item_no : cart.no},function(err,result){
        if(err) throw err;
        result.item_sales+=cart.quantity;
        result.save(function(err){
          if(err) throw err;
          console.log("item sales saved");
        });
      });
      req.user.local.orderList.unshift({order_id : req.user.local.order_id ,no:cart.no,item:cart.item,quantity:cart.quantity,price:cart.price,amount:cart.amount,status:"order placed"})

      return done(null);
    };

    var doneIteratingFcn = function(err) {
      if(err) throw err;
      req.user.local.todo = [];
      req.user.local.cart_enable = 0;
      done(null);
    }

    // iteratorFcn will be called for each element in cart.
    async.forEach(cart , iteratorFcn, doneIteratingFcn);
  }

  getorder(req.user.local.todo , function(err) {
    if(err) {
      throw err;
      return;
    }
    if(req.user.local.cart_enable == 1){
      getsales(req.user.local.todo , function(err){
        if(err) throw err;
        req.user.save(function(err){
          if(err) throw err;
        });
      });
    }
    req.flash('info','order placed successfully. Track your order on this page');
    res.redirect('/track_order');
  });
});


//#12*
app.post('/addstaff',isLoggedIn,  passport.authenticate('staff-signup', {
  successRedirect: '/addstaff',
  failureRedirect: '/addstaff',
  failureFlash: true
}));


//#13*
app.post('/orderslist', isLoggedIn, function(req, res){
  console.log(req.body.order_id);
  console.log(req.body.order_status);

  Orders.findOne({ order_id : req.body.order_id }, function(err, result){
    if(result == null){
      req.flash('error','No order found. Some error');
    }
    result.status = req.body.order_status;
    result.save(function(err){
      if(err)
        throw err;
    });
  });
  
  res.redirect('/orderslist');   
}); 

//#14*
app.post('/itemslist', isLoggedIn, function(req, res , done){
  Items.findOne({ item_no: req.body.item_no },function(err,result){
    if(err) throw err;
    if(result == null){
      console.log("no item found");
      req.flash('error','no item with this item No. exists in the database');
      res.redirect('/itemslist');
    }
    else{
      result.item_name = req.body.item_name;
      result.item_price = req.body.item_price;
      result.item_quantity = req.body.item_quantity;
      result.item_category = req.body.item_category;
      result.item_sales = req.body.item_sales;
      var obj = {
        change_name : req.body.item_name,
        change_price : req.body.item_price,
        change_quantity : req.body.item_quantity,
        change_sales : req.body.item_sales,
        change_category : req.body.item_category,
        change_remark : req.body.item_change,
        change_userid : req.user.local.email,
        change_time : new Date()};
        result.item_changes.push(obj);
        result.save(function(err){
          if(err)
            throw err;
          console.log("im saving");
        }); 
        req.flash('info','item has been edited');
        res.redirect('/deletestaff');
      }
    });
});




  //#15*
  app.post('/confirm_deleteitem', isLoggedIn, function(req, res){
    var del_item_no = req.body.itemno;
    Items.findOneAndRemove({ item_no: del_item_no },function(err , result){
      if(err) throw err;
      if(result == null){
        req.flash('error','no such item exists');
      }
      else{
        req.flash('info','Item has been successfully deleted');}
        res.redirect('/deleteitem');
      });
  });

//#16*
app.post('/deletestaff', isLoggedIn, function(req, res){
  var del_staff_id = req.body.email;
  User.findOneAndRemove({ 'local.email' : del_staff_id , 'local.admin' : "staff" },function(err , result){
    if(err) throw err;
    if(result == null){
      req.flash('error','no such staff ID exists');
    }
    else{
      req.flash('info','Staff has been successfully deleted');}
      res.redirect('/deletestaff');
    });
});

///#17*
app.post('/changepassword', function(req, res, next) {
  async.waterfall([
    function(done) {
      if(req.body.password != req.body.confirm_password){
        return done(null, false, req.flash('error', 'password and confirm password dont match'));
      }
      var user = req.user;
      user.local.password = user.generateHash(req.body.password);
      user.local.password = user.generateHash(req.body.password);

      user.save(function(err) {
        done(err, user);
      });
      req.flash('info', 'password has been changed.');
    }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/settings');
    });
});

//#18*
app.post('/delete_account', isLoggedIn, function(req, res){
  User.findOneAndRemove({ 'local.email' : req.user.local.email },function(err , result){
    if(err) throw err;
    if(result == null){
      req.flash('error','no such person exists');
    }
    else{
      req.flash('info','account has been successfully deleted');
    }
    res.redirect('/logout');
  });
});


//#19*
app.post('/for_sale_upload', isLoggedIn, function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req , function(err, fields, files){
    if(err) throw err;
    var oldpath = files.sale.path;
    var path = require('path');
    __parentDir = path.dirname(process.mainModule.filename);
    var newpath = __parentDir + '/assets/images/sale/' + files.sale.name;
    console.log(newpath);
    fs.rename(oldpath, newpath, function(err){
      if (err) throw err;
    });
    var item = new Sale_Items({
      sale_url: '/assets/images/sale/' + files.sale.name
    });
    item.save(function(err){
      if(err) throw err; 
    });
    console.log('File uploaded and moved!');
    req.flash('info','image uploaded . Enter other details.');
    res.render('for_sale',{ sale_id : item._id });
  });
});


//#20*
app.post('/for_sale', isLoggedIn, function(req, res) {
  console.log(req.body.sale_id);
  Sale_Items.findOne({ _id : req.body.sale_id }, function(err,result){
    result.sale_owner= req.user.local.email;
    result.sale_date=new Date();
    result.sale_contact=req.user.local.telephone;
    result.sale_name=req.body.sale_name;
    result.sale_price=req.body.sale_price;
    result.sale_quantity=req.body.sale_quantity;
    result.sale_dop=req.body.sale_Date_OP;
    result.sale_category=req.body.sale_category;
    result.sale_type=req.body.sale_type;
    result.sale_status=1;
    result.save(function(err){
      if ( err ) throw err;
      console.log("Sale Saved Successfully");
    });
    console.log('going on peacefully');
    req.flash('info','item put for sale successfully.');
    res.redirect('/categories');

  })
});

// //#21*
// app.post('/track_order', isLoggedIn, function(req, res) {
//   console.log(req.body);
//   Orders.findOne({ order_id : req.body.order_id } , function(err,result){
//     console.log(result);
//     if(err) throw err;
//     if(result == null){ req.flash('error','no such order id exists'); }
//     else{
//       Items.findOne({ item_no : req.body.item_no }, function(errr,item){
//         item.item_sales -= req.body.item_quantity;
//         item.save(function(err){
//           if(err) throw err;
//           console.log("item removed from sales");
//         }); 
//       });
//       for(var i=0; i<result.orderList.length; i++ ){
//         if(result.orderList[i].no == req.body.item_no){
//           if(result.orderList.length == 1)
//             result.status = "cancelled";
//           result.amount = result.amount - result.orderList[i].price*result.orderList[i].quantity;
//           result.orderList.splice(i,1);
//           result.save(function(err){
//            if(err) throw err;
//          });
//           req.flash('info','your order has been cancelled');
//         }
//       }
//       function getchange(list , done) {
//         console.log(list);
//         var iteratorFcn = function(list, done) {
//           if(list.order_id == req.body.order_id && list.no == req.body.item_no){
//             console.log("condition matched");
//             list.status = "cancelled";
//             console.log(list);
//             console.log(list.status);
//           }
//           return done(null,list);
//         };

//         var doneIteratingFcn = function(err) {
//           if(err) throw err;
//           req.user.save(function(err){
//             if(err) throw err;
//             console.log("status of user history changed");
//           });
//           console.log(req.user.local.orderList);
//           done(null,'done');
//         };
//     // iteratorFcn will be called for each element in cart.
//     async.forEach( list , iteratorFcn, doneIteratingFcn);
//   }
//   getchange(req.user.local.orderList , function(err) {
//     if(err) {
//       throw err;
//     }
//     req.user.save(function(err){
//       if(err) throw err;
//       console.log("cancellung saved");
//       console.log(req.user.local.orderList);
//     });
//     req.flash('info','order cancelled successfully.');
//   });
//   console.log("im here outside now");
//   console.log(req.user.local.orderList);
//   req.user.save(function(err){
//    if(err) throw err;
//   });
//   res.redirect('/track_order');
// }
// });
// });

//#21*
app.post('/track_order', isLoggedIn, function(req, res) {
  console.log(req.body);
  Orders.findOne({ order_id : req.body.order_id } , function(err,result){
    console.log(result);
    if(err) throw err;
    if(result == null){ req.flash('error','no such order id exists'); }
    else{
    async.parallel([
  function (callback) {
    //function getchange(list , done) {
          var iteratorFcn = function(list, done) {
            if(list.order_id == req.body.order_id && list.no == req.body.item_no){
              console.log("condition matched");
              list.status = "cancelled";
              req.user.markModified('local.orderList');
              req.user.save(function(err){
              if(err) throw err;
              console.log("status of user history changed");
              done(null,'done');
              });
            }
          };

          var doneIteratingFcn = function(err) {
            if(err) throw err;
            req.flash('info','order cancelled successfully.');
          };
    // iteratorFcn will be called for each element in cart.
    async.forEach( req.user.local.orderList , iteratorFcn, doneIteratingFcn);
    callback(null,'three');
    
  },
  function (callback) {

     var iteratorFcn = function(item,done){
          if(item.no == req.body.item_no){
          if(result.orderList.length == 1)
            result.status = "cancelled";
          result.amount = result.amount - item.price*item.quantity;
          item.status = "cancelled";
          // result.orderList.splice(i,1);
          result.save(function(err){
           if(err) throw err;
           console.log("order changed");
           req.flash('info','your order has been cancelled');
           done(null,'done');
         });
        }
    };


     async.forEach(result.orderList , iteratorFcn , function(err){ if(err) throw err; console.log("order modiied")});

      
    // do some stuff ...
    callback(null, 'two');
  },
  function(callback){
    Items.findOne({ item_no : req.body.item_no }, function(err,item){
        item.item_sales -= req.body.item_quantity;
        item.save(function(err){
          if(err) throw err;
          console.log("item removed from sales");
        }); 
      });
    callback(null, 'one');
    // do some stuff ...
    // callback(null, 'one');
  }
],
// optional callback
function (err, results) {
  // the results array will equal ['one','two']
  if (err) return next(err);
 res.redirect('/track_order');
});
}
});

});




};





function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }

  res.redirect('/login');
}