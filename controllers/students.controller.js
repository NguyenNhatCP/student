
const Student = require('../models/student.model');
const bcrypt = require('bcrypt');
const moment = require('moment');


module.exports.index = function(req,res){
	var pageData = {
  		title:'Account'
  }
	res.render('users/index',{
		pageData:pageData
		});
};

module.exports.search = function(req,res){
	 var pageData = {
		  	title:'Result'
  }
	var q = req.query.q;
	var matchedUsers = db.get('users').value().filter(function(user)
	{
			return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
		});
	res.render('users/index',{
		pageData:pageData,
		users : matchedUsers
		})
};

/* check if email already exists in database */
const create = function (req,res,next){
	try
	{
		Student.findOne({Sid: req.body.Sid},(err,student)=>
		{
			//check Sid has been exists yet
			if(student == null){
				bcrypt.hash(req.body.password,10, function(err,hash){
					if(err) {return next(err);}
					const newStudent = new Student(req.body);
					newStudent.password = hash;
					var day = req.body.Sbirthday;
					newStudent.Sbirthday = moment(day,'dd/mm/yyyy','YYYY-MM-DDTHH:mm:ssZ');
					newStudent.permission = 'student';
					newStudent.save((err,result)=>{
						if(err) {return res.status(400).send({
							result: 0,
							message: `Register student failed. Error: ${err}`
						})}
						res.status(200).send({
							result:1,
							user: result,
							message: 'Register student sucessfully!',
						})
					})
				})
			}
			else {
				res.status(200).send({
					result: 0,
					message:'Sid has been exists'
				})
			}
		})
	}
	catch(error){
		throw error;
	}
}
const createUser = async(req,res) => {
	var pageData = {
		title:'Create User',
	  	name: 'Form Register'
	}
	  res.render('users/create',{
		  pageData: pageData
	  });
  };
	/*
module.exports.get = function(req,res){
	var id = req.params.id;
	var user = db.get('users').find({id: id}).value();
	res.render('users/view',{
		user: user
	});
};

module.exports.postCreate = function(req,res){
	req.body.id = shortid.generate();
	req.body.avatar = req.file.path.split('/').slice(1).join('/');

	console.log(res.local);

	db.get('users').push(req.body).write();
	//Chuyển trang
	res.redirect('/users');
};
*/
module.exports ={create,createUser}