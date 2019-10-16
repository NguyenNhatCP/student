var express = require('express');
var authController = require('../controllers/auth.controller');
var router = express.Router();

router.get('/login',authController.indexLogin);
router.post('/login', async (req, res) => {
	let { Sid, Password } = req.body
	try {
		let foundUser = await authController.login(Sid, Password)
		res.status(200).send({
			code: 1,
			message: 'Login user successfully!',
			result: [foundUser]
		})
	} catch (error) {
		res.status(400).send({
			code: 0,
			message: `Login user error : ${error}`
		})
	}
})
router.get('/jwtTest', async (req, res) => {
	let tokenKey = req.body.token || req.headers['x-access-token']
	try {
		//Verify token
		await authController.verifyJWT(tokenKey)
		res.status(200).send({
			result: 1,
			message: 'Verify Json Web Token successully',
		})
	} catch (error) {
		res.status(401).send({
			result: 0,
			message: `Error check token : ${error}`
		})
	}
})

module.exports = router;
