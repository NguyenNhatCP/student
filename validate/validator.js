
const { check, validationResult } = require('express-validator');
exports.UserValidator = function(req,res,next)
{
    //name
    check('email', 'Invalid email.').isEmail();
    check('email', 'Email is required.').not().isEmpty();
    check('username', 'Username is required.').not().isEmpty();
    check('username', 'Username must be more than 1 characters').isLength({min:2});
    check('password', 'Password is required.').not().isEmpty();
    check('password', 'Password must be more than 6 characters').isLength({min:6});
    check('password_confirm', 'Password confirm is required.').not().isEmpty();
    check('password_confirm','Password mismatch').equals(req.body.password);
    //check for errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}