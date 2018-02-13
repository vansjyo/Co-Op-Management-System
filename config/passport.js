var LocalStrategy = require('passport-local').Strategy;
var passport= require('passport');
var User = require('../app/models/user');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var flash = require('express-flash');


module.exports = function(passport) {


	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});


	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'local.email': email}, function(err,user){
				if(err)
					return done(err);
				if(user){
					if(user.local.emailConfirmExpires == undefined){
						return done(null, false, req.flash('error', 'That email already taken'));
					}

					else{
						user.remove(function(err) {
							if(err)
								return done(err);
							return done(null,false, req.flash('error', 'That email already taken but no confirmation.Your account'+ 
								'has been deleted.so  you can signup again')); 
						});

					}

				} else {

					async.waterfall([
						function(done) {
							crypto.randomBytes(20, function(err, buf) {
								var token = buf.toString('hex');
								done(err, token);
							});
						},
						function(token, done) {

							var newUser = new User();
							newUser.local.email = email;
							newUser.local.password = newUser.generateHash(password);
							newUser.local.password = newUser.generateHash(password);
							newUser.local.emailConfirmToken=token,
							newUser.local.emailConfirmExpires= Date.now() + 3600000,
							newUser.local.firstname = req.body.firstname;
							newUser.local.lastname = req.body.lastname;
							newUser.local.telephone = req.body.telephone;
                            newUser.local.admin = false;
							newUser.save(function(err){
								if(err)
									throw err;
								return done(null, token, newUser);
							});

						},
						function(token, newUser, done) {
							var transporter = nodemailer.createTransport( {
								service: 'gmail',
								auth: {
									user: 'samplemailernitk@gmail.com',
									pass: '1234abcd!@#$'
								}
							}); 
							var mailOptions = {
								to: newUser.local.email,
								from: 'samplemailernitk@gmail.com',
								subject: 'Node.js email confirmation link',
								text: 'You are receiving this because you (or someone else) have requested to signup for our website your account.\n\n' +
								'Please click on the following link to complete the process:\n\n' + 'http://' + req.headers.host + '/confirm/' + token + '\n\n' +
								'If you did not signup, please ignore this email.\n'
							};

							transporter.sendMail(mailOptions, function(err, info) {
								if (err) {
									console.log(error);
									req.flash('error', 'email is invalid');
								}
								console.log("email has been sent");
								done(err, 'done');
							});
						}
						], function(err) {
							if (err){console.log("error here"); return done(err); }
							console.log("error me");
							req.flash('info', 'a confimtaion email has been sent to your regisered email ID. click on link to authenticate before you login.');
							return done(null);				
						});
				}
			})

		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({ 'local.email': email, 'local.emailConfirmToken': undefined}, function(err, user){
				if(err)
					return done(err);
				if(!user)
					return done(null, false, req.flash('error', 'No User found'));
				if(!user.validPassword(password))
					return done(null, false, req.flash('error', 'invalid password'));

				return done(null, user);

			});
		});
	}
	));


};



