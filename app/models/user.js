var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// describe our database user schema
var userSchema = mongoose.Schema({
	local: {
		username: String,
		password: String
	}
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

// memungkinkan akses di luar file
module.exports = mongoose.model('User', userSchema);