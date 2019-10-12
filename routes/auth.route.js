var express = require('express');
var authController = require('../controllers/auth.controller');
var router = express.Router();

router.get('/login',authController.indexLogin);
router.post('/login', async (req, res) => {
	let { email, password } = req.body
	try {
		let foundUser = await authController.login(email, password)
		res.json({
			status: 200,
			code: 1,
			message: 'Login user successfully!',
			result: [foundUser]
		})
	} catch (error) {
		res.json({
			status: 200,
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
		res.json({
			result: 'ok',
			message: 'Verify Json Web Token successully',
		})
	} catch (error) {
		res.json({
			result: 'false',
			message: `Error check token : ${error}`
		})
	}
})

module.exports = router;
