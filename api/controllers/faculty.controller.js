
const authController = require('./auth.controller');
const Faculty = require('../models/faculty.model');

const create = async (transcript, tokenKey) => {
    let { Fid, Fname } = transcript
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        if (signedInUser.Permission !== 'admin')
            throw ('Only admin can do action')
        //check Fid has been exists yet
        let checkFaculty = await Faculty.findOne({ Fid: Fid })
        if (checkFaculty) throw (' Fid ' + Fid + ' has been exists');
        else {
            let newFaclty = await Faculty.create({
                Fid: Fid,
                Fname: Fname,
            })
            return newFaclty
        }
    } catch (error) {
        throw error
    }
}
const getFaculty = async (tokenKey) => {
    try {
        let signedInUser = await authController.verifyJWT(tokenKey);
        if (signedInUser.Permission !== 'admin') {
            throw "You cannot do this action"
        }
        var faculty = await Faculty.find({})
        return faculty;
    }
    catch (error) {
        throw error;
    }
}
const deleteById = async (Fid, tokenKey) => {
    try {
        let signedInUser = await authController.verifyJWT(tokenKey);
        if (signedInUser.Permission !== 'admin') {
            throw "Only admin can do this action"
        }
        let transcript = await Transcript.findByIdAndDelete(Fid)
        if (!transcript) {
            throw "transcript not found"
        }
        await Student.updateOne(
            { Transcript: transcriptId },
            {
                $pull: { Transcript: transcriptId }
            })
    } catch (error) {
        throw error
    }
}
module.exports = { create, getFaculty, deleteById }
