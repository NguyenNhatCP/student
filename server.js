require('dotenv').config();
console.log(process.env.SESSION_SECRET);

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//const fileUpload = require('express-fileupload');
const csurf = require('csurf');
const properties = require('./config/properties');

const studentRoutes = require('./routes/student.route');
const authRoute = require('./routes/auth.route');
const productRoute = require('./routes/product.route');
const cartRoute = require('./routes/cart.route');
const tranferRoute = require('./routes/tranfer.route');
const apiProductRoute = require('./api/routes/product.route');

const authMiddleware = require('./middlewares/auth.middleware');
const sessionMiddelWare = require('./middlewares/session.middleware');


const port = 3000;

const app = express();
app.use(express.static('public'));

//Connect db
var db = require('./config/database');
// call the database connectivity function
db();

//POST Params 
app.use(bodyParser.json()); // for parsing application/json. Speacial: bodyParse does not support for upload multi-media file (image...)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET));
//app.use(csurf({cookie: true}));
//app.use(sessionMiddelWare);

app.set('view engine', 'pug');
app.set('views', './views');

// Config response header
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
	next();
});

app.get('/', function (req, res) {
	const pageData = {
		title: 'Home - Car Shopping',
		name: 'index'
	};
	res.render('index', {
		pageData: pageData
	});
});

//Router 
app.use('/api/products', apiProductRoute);
app.use('/student', studentRoutes);
app.use('/auth', authRoute);
app.use('/products', sessionMiddelWare, productRoute);
app.use('/cart', cartRoute);
app.use('/tranfer', csurf({ cookie: true }), tranferRoute);

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error("Not Found");
	err.status = 404;
	next(err);
  });
  // error handler
  app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
  
	// render the error page
	res.status(err.status || 500);
	res.render('error');
  });
  
  
  // limit the file size uploading 
app.use(fileUpload({
	  limits: { fileSize: 50 * 1024 * 1024 },
  }));*/

app.listen(properties.PORT, function () {
	console.log('Server listening on port ' + port);
});