var LocalStrategy 	= require('passport-local').Strategy;
var FacebookStrategy= require('passport-facebook').Strategy;
var User 			= require('../app/models/user');
var configAuth 		= require('./auth'); 

module.exports = function(passport) {

	// Session Login (seriliaze & deserialize)
	passport.serializeUser(function(user, done) {
		done(null, user.id)
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// Local Strategy
	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		process.nextTick(function() {
			User.findOne({'local.username': email}, function(err, user){
				if (err)
					return done(err);
				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email already taken'));
				}
				else {
					var newUser = new User();
					newUser.local.username = email;
					newUser.local.password = newUser.generateHash(password);

					newUser.save(function(err) {
						if (err)
							throw err;
						return done(null, newUser);
					});
				}
			});
		});
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'local.username': email}, function(err, user){
				if (err)
					return done(err);
				if (!user)
					return done(null, false, req.flash('loginMessage', 'No User Found'));
				if(!user.validPassword(password))
					return done(null, false, req.flash('loginMessage', 'Invalid Password'));
				return done(null, user);
			});
		});
	}));

	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret,
		callbackURL: configAuth.facebookAuth.callbackURL
	},
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function() {
			User.findOne({'facebook.id': profile.id}, function(err, user){
				if (err)
					return done(err);
				if (user)
					return done(null, user);
				else {
					var newUser = new User();
					newUser.facebook.id = profile.id;
					newUser.facebook.token = accessToken;
					newUser.facebook.name = profile.displayName;
					newUser.facebook.email = profile.emails;

					newUser.save(function(err){
						if (err) 
							throw err;
						return done(null, newUser);
					});
					console.log(profile);
				}
			});
		});
	}));
}