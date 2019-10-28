
const authController = require('./auth.controller');
const Student = require('../models/student.model');
const Subject = require('../models/subject.model');
const Faculty = require('../models/faculty.model');
const Transcript = require('../models/transcript.model');

const findSubjectIdFromFid = async (Fid) => {
    try {
        let arrayObject = await Faculty.find({ Fid: { $in: Fid } }).select('_id')
        let array = arrayObject.map(item => item["_id"].toString())
        return array
    } catch (error) {
        throw error
    }
}
const findStudentIdFromSid = async (Sid) => {
    try {
        let arrayObject = await Student.find({ Sid: { $in: Sid } }).select('_id')
        let array = arrayObject.map(item => item["_id"].toString())
        return array
    } catch (error) {
        throw error
    }
}
const findSubjectIdFromSname = async (Sbname) => {
    try {
        let arrayObject = await Subject.find({ Sbname: { $in: Sbname } }).select('_id')
        let array = arrayObject.map(item => item["_id"].toString())
        return array
    } catch (error) {
        throw error
    }
}
const addToStudent = async (transcriptId, studentId) => {
    try {
        await Student.updateOne(
            { _id: { $in: studentId } },
            { $push: {Transcript: transcriptId}}
        )
    } catch (error) {
        throw error
    }
}
const getArraySubjects = async(Fid) =>{
    try{
        let subjectId = await findSubjectIdFromFid(Fid);
        let subjects = await Subject.find({
            $or: [{
                "Faculty": {$in:[[],subjectId]}
                }]
    });
        return subjects;
    } catch(error)
    {
         throw error;
    }
}
const create = async (transcript, tokenKey) => {
    let {Sid,Rpoint, Mpoint, Epoint,S_id,Sbname} = transcript
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        if(signedInUser.Permission !== 'admin')
            throw ('Only admin can do action')
        let StudentId = await findStudentIdFromSid(S_id)
        let SubjectIds = await findSubjectIdFromSname(Sbname)
        let newTranscript = await Transcript.create({
            Sid: Sid,
            Rpoint: Rpoint,
            Mpoint: Mpoint,
            Epoint:Epoint,
            Student: StudentId,
            Subjects: SubjectIds
        })
        addToStudent(newTranscript._id, StudentId)
        return newTranscript
    } catch (error) {
        throw error
    }
}
const getTranscript = async (Sid,tokenKey) =>{
    try{
        let signedInUser = await authController.verifyJWT(tokenKey);
        if (signedInUser.Permission !== 'student' && signedInUser.Permission !== 'admin') {
            throw "You cannot do this action"
        }
        var transcript = await Transcript.find({
            Sid: Sid
        })
        .populate('Subjects')
        return transcript;
    }
    catch(error)
    {
        throw error;
    }
}
const update = async(_id,transcript,tokenKey)=>{
    let {Rpoint, Mpoint, Epoint} = transcript;
    try {
        let signedInUser = await authController.verifyJWT(tokenKey)
        if(signedInUser.Permission !== 'admin')
            throw ('Only admin can do action')
        let transcript = await Transcript.findById(_id);
        if (!transcript) throw `Can not find transcript with Id=${_id}`
        const query = {
            ...(Rpoint && {Rpoint}),
            ...(Mpoint && {Mpoint}),
            ...(Epoint && {Epoint}),
        }
        Promise.all([
            transcript = Transcript.findByIdAndUpdate(_id,query,{new:true})
        ])
        return transcript;
    } catch (error) {
        throw error
    }
}
const deleteById = async (transcriptId, tokenKey) => {
    try {
        let signedInUser = await authController.verifyJWT(tokenKey);
        if (signedInUser.Permission !== 'admin') {
            throw "Only admin can do this action"
        }
        let transcript = await Transcript.findByIdAndDelete(transcriptId)
        if (!transcript) {
            throw "transcript not found"
        }
        await Student.updateOne(
            {Transcript: transcriptId},
            {$pull: {Transcript: transcriptId}
        })
    } catch (error) {
        throw error
    }
}
module.exports = {create,getTranscript,update,deleteById,getArraySubjects}
