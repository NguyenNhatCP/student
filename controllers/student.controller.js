const authController = require('./auth.controller');
const Student = require('../models/student.model');
const bcrypt = require('bcrypt');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

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

const create = async (student, tokenKey) => {
	let {Sid,Slname,Sfname,Sgender,Sbirthday,
		Sbirthplace,Strain,Fid,Syear,Cid,Password,Savatar} = student;
		try {
		let	signedInUser = await authController.verifyJWT(tokenKey);
		if(signedInUser.Permission !== 'admin') throw ('Only admin can do this action');
		//check Sid has been exists yet
		let user = await Student.findOne({Sid: Sid})
			if(user)  throw (' Sid ' + Sid + ' has been exists');
			else
			{
			bcrypt.hash(Password,10, function(err,hash) {
				if(err) {throw err;}
				const newStudent = new Student({
					Sid: Sid,
					Slname: Slname,
					Sfname: Sfname,
					Sgender: Sgender,
					Sbirthplace: Sbirthplace,
					Strain: Strain,
					Fid: Fid,
					Syear: Syear,
					Cid: Cid});
				newStudent.Password = hash;
				var day = Sbirthday;
				newStudent.Sbirthday = moment(day,'dd/mm/yyyy','YYYY-MM-DDTHH:mm:ssZ');
				newStudent.Permission = 'student';
				newStudent.Savatar = Savatar;
				newStudent.save();
				return student;
				})			
			}
	}
	catch(error){
		throw error;
	}
}

const update = async (id,updateStudent,tokenKey) => {
	let {Slname,Sfname,Sgender,Sbirthday,
		Sbirthplace,Strain,Fid,Syear,Cid,Savatar} = updateStudent;
	try{
		let student = await Student.findById(id);
		let	signedInUser = await authController.verifyJWT(tokenKey);
	if(signedInUser.Permission !== 'admin') throw ('Only admin can do this action');
	if(!student) throw `Can not find student with Id=${id}`
	var filePath = path.resolve('./public/'+student.Savatar); 
	fs.unlink(filePath, function(err) {
		if(err && err.code == 'ENOENT') {
			// file doens't exist
			console.log(filePath);
			console.info("File doesn't exist, won't remove it.");
		} else if (err) {
			// other error
			console.error("Error occurred while trying to remove file");
		} else {
			console.info(`removed`);
		}
	});	
	const query = {
		...(Slname && {Slname}),
		...(Sfname && {Sfname}),
		...(Sgender && {Sgender}),
		...(Sbirthday && {Sbirthday}),
		...(Sbirthplace && {Sbirthplace}),
		...(Strain && {Strain}),
		...(Fid && {Fid}),
		...(Syear && {Syear}),
		...(Cid && {Cid}),
		...(Savatar && {Savatar}),
	}
	Promise.all([
		student = Student.findByIdAndUpdate(id,query,{new:true})
	]);
	return student;
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
module.exports ={create,createUser,update}