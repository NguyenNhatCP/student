const express = require('express');
const router = express.Router();
const multer = require('multer');
const moment = require('moment');

/*save loaction image*/ 
const path = './public/uploads/';

const validate = require('../validate/user.validate');
const storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, path)
	},
	filename: (req, file, callback) => {
		// name file + time avoid the same name err
		var id_photo = new Date();
		var dd = id_photo.getDate();
		var mm = id_photo.getMonth() + 1; //January is 0!
		var yyyy = id_photo.getFullYear();
		var h = id_photo.getHours();
		var i = id_photo.getMinutes();
		var s = id_photo.getSeconds();
		if (dd < 10) {
			dd = '0' + dd
		}
		if (mm < 10) {
			mm = '0' + mm
		}
		if (h < 10) {
			h = '0' + h
		}
		if (i < 10) {
			i = '0' + i
		}
		if (s < 10) {
			s = '0' + s
		}
		id_photo = dd + '-' + mm + '-' + yyyy + '-' + h + ':' + i + ':' + s;
		callback(null, id_photo + "*-" + file.originalname);
		}
  })
  const fileFilter = (req,file,callback)=>{
	  //reject a file
	  if(!file.mimetype.match(/jpe|jpeg|png|gif$i/)){
		callback(new Error('File is not supported'), false)
		return
	}
		callback(null, true)
  }

   
const upload = multer({ storage: storage, limits:{
	fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
}).single('Savatar');

const controller = require('../controllers/student.controller');

//router.get('/',controller.index);
router.get('/cookie',function(req,res,next)
{
	res.cookie('user-id',12345);
	res.send('Hello');
});
//router.get('/search',controller.search);
router.post('/register-student',upload,async(req,res)=>{
	var day = req.body.Sbirthday;
	var Sbirthday = moment(day,'dd/mm/yyyy','YYYY-MM-DDTHH:mm:ssZ');
	var Savatar = req.file.path.split('/').slice(1).join('/');
	let {Sid,Slname,Sfname,Sgender,Sbirthplace,Strain,Fid,Password,Syear,Cid} = req.body;
	let tokenKey = req.headers['x-access-token'];
	try{
		let student = await controller.create({Sid,Slname,Sfname,Sgender,Sbirthday,
			Sbirthplace,Strain,Fid,Syear,Cid,Password,Savatar},tokenKey);
			res.status(200).send({
				result: 1,
				message: 'register user sucessfully',
				data: student,
		})
	}
	catch(error)
	{
		res.status(400).send({
			result: 0,
			message: `register user failed.Error${error}`,
		})
	}
})
router.put('/update',upload,async (req,res)=>{
	var day = req.body.Sbirthday;
	var Sbirthday = moment(day,'dd/mm/yyyy','YYYY-MM-DDTHH:mm:ssZ');
	var Savatar = req.file.path.split('/').slice(1).join('/');
	let {_id,Slname,Sfname,Sgender,Sbirthplace,Strain,Fid,Syear,Cid} = req.body;
	let tokenKey = req.headers['x-access-token']
	try{
		let student = await controller.update(_id,{Slname,Sfname,Sgender,Sbirthday,
			Sbirthplace,Strain,Fid,Syear,Cid,Savatar},tokenKey);
		res.status(200).send({
			result: 1,
			message: 'update student sucessfully',
			studentInf: student,
		})
	}
	catch(error){
		res.status(400).send({
			result: 0,
			message: `cannot update student ${error}`
		})
	};
})
router.post('/delete-by-id', async (req, res) => {
    let tokenKey = req.headers['x-access-token']
    let { studentId } = req.body
    try {
        await controller.deleteById(studentId, tokenKey)
        res.status(200).send({
            result: 1,
            message: 'Delete student successfully!'
        })
    } catch (error) {
        res.status(400).send({
            message: `Error delete student: ${error}`
        })
    }
})
router.get('/all-student', async(req,res) =>{
	let tokenKey = req.headers['x-access-token'];
	var page = parseInt(req.query.page) || 1; //n=1
    var perPage = 5;
	try
	{
		var students = await controller.getAllStudent(page,perPage,tokenKey)
		var count = students.length;
			res.status(200).send({
				result: 0,
				message: 'Get the list of successful students',
				data: {
				students: students,
				current: page,
				pages: Math.ceil(count / perPage),
				ofset: count
				}
		})
	}
	catch(error)
	{
		res.status(400).send({
			result: 0,
			message: `Cant get list student ${error}`
		})
	}
})
router.get('/search',async (req,res)=>{
	let tokenKey = req.headers['x-access-token'];
	var page = parseInt(req.query.page) || 1; //n=1
    var perPage = 5;
	let {Sid,Sfname,Slname} = req.query;
	try{
		let students = await controller.searchList(page,perPage,Sid,Sfname,Slname,tokenKey)
		var count = students.length;
		res.status(200).send({
			result: 1,
			message: 'Query success list of student',
			data: students,
			current: page,
			pages: Math.ceil(count / perPage),
			ofset: count
		})
	}
	catch(error)
	{
		res.status(400).send({
			result: 0,
			message: `Student not found: ${error}`
		})
	}
})
module.exports = router;
