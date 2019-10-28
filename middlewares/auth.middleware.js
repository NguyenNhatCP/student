const User = require('../models/student.model');

module.exports.requireAuth = function(req,res,next){
	console.log(req.cookies,req.signedCookies);
	if(!req.signedCookies.userId){
		res.redirect('/auth/login');
		return;
	}

	let user = User.find({
		_id: req.signedCookies.userId
	})
	if(!user)
	{
		res.redirect('/auth/login');
		return;
	}
	res.locals.user = user;
	next();
};
module.exports.requireAuthAdmin = async(req,res,next) =>{
	console.log(req.cookies,req.signedCookies);
	if(!req.signedCookies.userId){
		res.redirect('/auth/login');
		return;
	}

	let user = await User.find({
		_id: req.signedCookies.userId,
		Permission: 'admin'
	})
	if(user.length < 1)
	{
		res.redirect('/auth/login');
		return;
	}
	res.locals.user = user;
	next();
};