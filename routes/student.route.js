const express = require('express');
const router = express.Router();
const validate = require('../validate/user.validate');

const controller = require('../controllers/students.controller');

//router.get('/',controller.index);
router.get('/cookie', function (req, res, next) {
	res.cookie('user-id', 12345);
	res.send('Hello');
});
//router.get('/search',controller.search);
router.get('/create', controller.createUser);
router.post('/register-student', controller.create)
//router.get('/:id',controller.get);
module.exports = router;
