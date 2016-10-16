var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

/*
	Cookie adalah sebuah nilai yang dikirimkan dan ditanamkan server pada komputer client. Biasanya informasi-informasi yang disimpan dalam cookie ini adalah informasi yang berkaitan dengan user.
	Session adalah salah satu fasilitas yang ada pada PHP yang digunakan untuk menyimpan data sementara ke dalam variabel (variabel session) sehinga data tadi dapat di akses oleh client selama variabel session tadi tidak di kosongkan atau dihilangkan.

	Cookie parser: menjadi header antara client & server transaction
	Express session: memungkinkan untuk mengAuthentikasi antar clien dan server
*/
var cookieParser = require('cookie-parser');
var session = require('express-session');

/*
	Morgan:
	Berfungsi untuk menampilkan log (riwayat) tentang traffic, request, response, dll
	ke dalam console/terminal
*/
var morgan = require('morgan');

/*
	Memungkinkan kita dalam menggunakan nodejs dalam berkomunikasi dengan mongodb
*/
var mongoose = require('mongoose');

// load database config file
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);

app.use(morgan('dev'));
app.use(cookieParser());

/*
	Parameter:
	- secret: key code yang kita gunakan pada console
	- saveUninitialized: Ketika kita ingin menyimpan informasi session seperti data dalam database maka kita harus pastikan user login (login session)
	- resave: kalo gak ada perubahan sama sekali session tetap tersimpan
*/
app.use(session({
	secret: 'anystringoftext',
	saveUninitialized: true,
	resave: true
}));

// app.use('/', function(req, res){
// 	res.send('Our First Express Pragram!');
// 	console.log(req.cookies);
// 	console.log('==============');
// 	console.log(req.session);
// });

// memberi tahu server bahwa routes berada di tempat yang terpisah
require('./app/routes.js')(app);

app.listen(port);
console.log('Server running on port ' + port);