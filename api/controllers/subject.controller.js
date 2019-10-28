
const authController = require('./auth.controller');
const Subject = require('../models/subject.model');
const Faculty = require('../models/faculty.model');

const findFacultyIdFromFname = async (Fname) => {
	try {
		let arrayObject = await Faculty.find({ Fname: { $in: Fname } }).select('_id')
		let array = arrayObject.map(item => item["_id"].toString())
		return array
	} catch (error) {
		throw error
	}
}
const create = async (subject, tokenKey) => {
    let { Sbid,Sbname,Credit,Fname} = subject
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        if(signedInUser.Permission !== 'admin')
            throw ('Only admin can do action')
        let facultyId = await findFacultyIdFromFname(Fname);
        let newSubject = await Subject.create({
            Sbid: Sbid,
            Sbname: Sbname,
            Credit: Credit,
            Faculty: facultyId
        })
        return newSubject
    } catch (error) {
        throw error
    }
}
module.exports = {create}
