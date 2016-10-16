var mongoose = require('mongoose');

// describe our database user schema
var userSchema = mongoose.Schema({
	local: {
		username: String,
		password: String
	}
});

// memungkinkan akses di luar file
module.exports = mongoose.model('User', userSchema);