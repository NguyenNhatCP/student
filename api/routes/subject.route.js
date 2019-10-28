const express = require('express');
const controller = require('../controllers/subject.controller');
const router = express.Router();

router.post('/create',async(req,res) =>{
    let{Sbid,Sbname,Credit,Fname} = req.body;
    let tokenKey = req.headers['x-access-token']; 
    try{
        let newSubject = await controller.create({Sbid,Sbname,Credit,Fname},tokenKey)
        res.status(200).json({
            result: 1,
            message: 'Create new Subject success',
            data: newSubject
        })
    }
    catch(error){
        res.status(400).json({
            result: 0,
            message: `Cannot create new Subject ${error}`
        })
    }
})

module.exports = router;

