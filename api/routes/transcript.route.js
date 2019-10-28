const express = require('express');
const controller = require('../controllers/transcript.controller');
const router = express.Router();

router.get('/getArraySubjects',async(req,res)=>{
    let Fid = req.body.Fid;
    try{
        let infoTranscript = await controller.getArraySubjects(Fid)
        res.status(200).json({
            result: 1,
            message: 'Get list of successful subject',
            data: infoTranscript
        })
    }
    catch(error){
        res.status(400).json({
            result: 0,
            message: `Cannot get list of subject ${error}`
        })
    }
})
router.post('/create',async(req,res) =>{
    let{Sid,Rpoint,Mpoint,Epoint,S_id,Sbname} = req.body;
    let tokenKey = req.headers['x-access-token']; 
    try{
        let newTranscript = await controller.create({Sid,Rpoint,Mpoint,Epoint,S_id,Sbname},tokenKey)
        res.status(200).send({
            result: 1,
            message: 'Create new Transcript success',
            data: newTranscript
        })
    }
    catch(error){
        res.status(400).send({
            result: 0,
            message: `Cannot create new Trancript ${error}`
        })
    }
})
router.post('/update',async(req,res)=>{
    let {_id,Rpoint,Mpoint,Epoint} = req.body;
    let tokenKey = req.headers['x-access-token'];
    try{
        let trancript = await controller.update(_id,{Rpoint,Mpoint,Epoint},tokenKey);
        res.status(200).json({
            result: 1,
            message: 'Update transcript sucessfully',
            data: trancript
        })
    } catch(error)
    {
        res.status(400).json({
            result: 0,
            message: `Cannot update transcript ${error}`
        })
    }
})
router.get('/getTranscript',async(req,res)=>{
    let Sid = req.body.Sid;
    let tokenKey = req.headers['x-access-token']; 
    try{
        let infoTranscript = await controller.getTranscript(Sid,tokenKey)
        res.status(200).json({
            result: 1,
            message: 'Get list of successful transcript',
            data: infoTranscript
        })
    }
    catch(error){
        res.status(400).json({
            result: 0,
            message: `Cannot get list of trancript ${error}`
        })
    }
})
router.post('/delete-by-id', async (req, res) => {
    let tokenKey = req.headers['x-access-token']
    let { transcriptId } = req.body;
    try {
        await controller.deleteById(transcriptId, tokenKey)
        res.status(200).send({
            result: 1,
            message: 'Delete transcript successfully!'
        })
    } catch (error) {
        res.status(400).send({
            message: `Error delete transcript: ${error}`
        })
    }
})
module.exports = router;

