const authController = require('./auth.controller');
const Student = require('../models/student.model');
const Transcript = require('../models/transcript.model');
const Faculty = require('../models/faculty.model');
const randomSid = require('../random_Sid/random_idStudent');
const bcrypt = require('bcrypt');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const findFacultyIdFromFname = async (Fname) => {
	try {
		let arrayObject = await Faculty.find({ Fname: { $in: Fname } }).select('_id')
		let array = arrayObject.map(item => item["_id"].toString())
		return array
	} catch (error) {
		throw error
	}
}
module.exports.index = function (req, res) {
	var pageData = {
		title: 'Account'
	}
	res.render('users/index', {
		pageData: pageData
	});
};
const createUser = async (req, res) => {
	var pageData = {
		title: 'Create User',
		name: 'Form Register'
	}
	res.render('users/create', {
		pageData: pageData
	});
};
module.exports.search = function (req, res) {
	var pageData = {
		title: 'Result'
	}
	var q = req.query.q;
	var matchedUsers = db.get('users').value().filter(function (user) {
		return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
	});
	res.render('users/index', {
		pageData: pageData,
		users: matchedUsers
	})
};
const create = async (student, tokenKey) => {
	let { Slname, Sfname, Sgender, Sbirthday,
		Sbirthplace, Strain, Fid, Syear, Cid, Password, Savatar, Fname } = student;
	try {
		let signedInUser = await authController.verifyJWT(tokenKey);
		if (signedInUser.Permission !== 'admin') throw ('Only admin can do this action');
		let Sid = Number(randomSid());
		console.log(Sid);
		//check Sid has been exists yet
		let user = await Student.findOne({ Sid: Sid })
		if (user) throw (' Sid ' + Sid + ' has been exists');
		else {
			let facultyId = await findFacultyIdFromFname(Fname);
			bcrypt.hash(Password, 10, function (err, hash) {
				if (err) { throw err; }
				const newStudent = new Student({
					Sid: Sid,
					Slname: Slname,
					Sfname: Sfname,
					Sgender: Sgender,
					Sbirthplace: Sbirthplace,
					Strain: Strain,
					Fid: Fid,
					Syear: Syear,
					Cid: Cid,
					Faculty: facultyId
				});
				newStudent.Password = hash;
				var day = Sbirthday;
				newStudent.Sbirthday = moment(day, 'dd/mm/yyyy', 'YYYY-MM-DDTHH:mm:ssZ');
				newStudent.Permission = 'student';
				newStudent.Savatar = Savatar;
				newStudent.save();
				return student;
			})
		}
	}
	catch (error) {
		throw error;
	}
}

const update = async (id, updateStudent, tokenKey) => {
	let { Slname, Sfname, Sgender, Sbirthday,
		Sbirthplace, Strain, Fid, Syear, Cid, Savatar } = updateStudent;
	try {
		let student = await Student.findById(id);
		let signedInUser = await authController.verifyJWT(tokenKey);
		if (signedInUser.Permission !== 'admin') throw ('Only admin can do this action');
		if (!student) throw `Can not find student with Id=${id}`
		var filePath = path.resolve('./public/' + student.Savatar);
		fs.unlink(filePath, function (err) {
			if (err && err.code == 'ENOENT') {
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
			...(Slname && { Slname }),
			...(Sfname && { Sfname }),
			...(Sgender && { Sgender }),
			...(Sbirthday && { Sbirthday }),
			...(Sbirthplace && { Sbirthplace }),
			...(Strain && { Strain }),
			...(Fid && { Fid }),
			...(Syear && { Syear }),
			...(Cid && { Cid }),
			...(Savatar && { Savatar }),
		}
		Promise.all([
			student = Student.findByIdAndUpdate(id, query, { new: true })
		]);
		return student;
	}
	catch (error) {
		throw error;
	}
}
const deleteById = async (studentId, tokenKey) => {
	try {
		let signedInUser = await authController.verifyJWT(tokenKey);
		if (signedInUser.Permission !== 'admin') {
			throw "Only admin can do this action"
		}
		let checkStudent = await Student.find({ _id: studentId });
		if (checkStudent.Status !== 1) {
			throw ("Students are still studying at the school")
		}
		let student = await Student.findByIdAndDelete(studentId)
		await Transcript.deleteMany({ Student: studentId });
		var filePath = path.resolve('./public/' + student.Savatar);
		fs.unlink(filePath, function (err) {
			if (err && err.code == 'ENOENT') {
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
		if (!student) {
			throw "student not found"
		}
	} catch (error) {
		throw error
	}
}
const getAllStudent = async (page, perPage, tokenKey) => {
	try {
		let signedInUser = await authController.verifyJWT(tokenKey);
		if (signedInUser.Permission !== 'admin') {
			throw "Only admin can do this action"
		}
		var student = await Student.find({ Permission: 'student' })
			.skip((perPage * page) - perPage)
			.limit(perPage)
		return student;
	}
	catch (error) {
		throw error
	}
}
const searchList = async (page, perPage, Sid, Sfname, Slname, tokenKey) => {
	try {
		let signedInUser = await authController.verifyJWT(tokenKey);
		if (signedInUser.Permission !== 'student' && signedInUser.Permission !== 'admin') {
			throw "You cannot do this action"
		}
		let student = await Student.find({
			Permission: 'student',
			$or:
				[
					{ Sid: Sid },
					{ Sfname: new RegExp(".*" + Sfname + ".*") },
					{ Slname: new RegExp(".*" + Slname + ".*") }
				]
		}).skip((perPage * page) - perPage)
			.limit(perPage)
		return student;
	}
	catch (error) {
		throw error;
	}
}
module.exports = {
	create,
	createUser,
	update,
	deleteById,
	getAllStudent,
	searchList
}