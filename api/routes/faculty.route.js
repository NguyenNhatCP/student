const express = require('express');
const controller = require('../controllers/faculty.controller');
const router = express.Router();

router.post('/create',async(req,res) =>{
    let{Fid,Fname} = req.body;
    let tokenKey = req.headers['x-access-token']; 
    try{
        let newFaculty = await controller.create({Fid,Fname},tokenKey)
        res.status(200).json({
            result: 1,
            message: 'Create new Faculty success',
            data: newFaculty
        })
    }
    catch(error){
        res.status(400).json({
            result: 0,
            message: `Cannot create new Faculty ${error}`
        })
    }
})
router.get('/getFaculty',async(req,res)=>{
    let tokenKey = req.headers['x-access-token']; 
    try{
        let infoFaculty = await controller.getFaculty(tokenKey)
        res.status(200).json({
            result: 1,
            message: 'Get list of successful Faculty',
            data: infoFaculty
        })
    }
    catch(error){
        res.status(400).json({
            result: 0,
            message: `Cannot get list of Faculty ${error}`
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

