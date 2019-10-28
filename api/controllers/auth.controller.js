const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretString = "secret string";
const User = require('../models/student.model');


const indexLogin = function(req,res){
  var pageData = {
  	title:'Login',
    name: 'Form Login'
  }
	res.render('auth/login',{
		pageData: pageData
	});
};

const login = async (Sid,Password) => {
	try{
		let foundUser = await User.findOne({Sid: Sid.trim()}).exec()
		if(!foundUser)
		{
			throw "Sid does not exist"
		}
		let encryptedPassword = foundUser.Password
		let checkPassword = await bcrypt.compare(Password, encryptedPassword)
		if(checkPassword == true)
		{
		let jsonObject = {id : foundUser._id}
		let tokenKey = await jwt.sign(jsonObject,
			secretString)
		//,{
			//expiresIn: 86400 //Expire in 24h
		//}
		let userObject = foundUser.toObject()
			userObject.tokenKey = tokenKey
			return userObject
		}
		else
		{
			throw 'Mã sinh viên hoặc mật khẩu không đúng!!!' 
		}
	}
	catch(error)
	{
		throw error	
	}
}
const verifyJWT = async (tokenKey) => {
    try {
        let decodedJson = await jwt.verify(tokenKey, secretString)
        //if (Date.now() / 1000 > decodedJson.exp) {
          //  throw "Token hết hạn, mời bạn login lại"
        //}
        let foundUser = await User.findById(decodedJson.id)
        if (!foundUser) {
            throw "Ko tìm thấy user với token này"
        }
        return foundUser
    } catch (error) {
        throw error
    }
}
module.exports = {indexLogin,login,verifyJWT};
/*module.exports.postLogin = function(req,res){

	var email = req.body.email;
	var password = req.body.password;

	var user = db.get('users').find({email: email}).value();

	if(!user)
	{
		res.render('auth/login',{
			errors:[
			'User does not exist.'
			],
			values: req.body
		});
		return;
	}

	var hashedPassword = md5(password);

	if (user.password !== hashedPassword) {
		res.render('auth/login',{
			errors:[
			'Wrong password.'
			],
			values: req.body
		});
		return;
	}
	res.cookie('userId',user.id ,{
		signed: true
	});
	res.redirect('/users');
};
*/
