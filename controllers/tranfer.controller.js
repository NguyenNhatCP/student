var db = require('../db');
var shortid =require('shortid');

module.exports.create = function(req,res,next){
	res.render('tranfer/create',{
		csrfToken: req.csrfToken()
	});
};

module.exports.postCreate = function(req,res,next){
	var data = {
		id: shortid.generate(),
		amount: parseInt(req.body.amount),
		accountid: req.body.accountId,
		userId: req.signedCookies.userId
	};

	db.get('tranfers').push(data).write();
	res.redirect('/tranfer/create');
};