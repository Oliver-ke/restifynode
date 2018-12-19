const errors = require('restify-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config');
const auth = require('../auth');

module.exports = server =>{
    //register users
    server.post('/register', async(req,res,next)=>{
        const {email, password} = req.body;
       try {
           const fUser = await User.find({email});
           console.log(fUser);
            if(fUser.length > 0)  next(new errors.InternalError("Email Exist"));
            else{
                const user = new User({
                    email,
                    password
                });
                bcrypt.genSalt(10, (err,salt) =>{
                    bcrypt.hash(user.password, salt, async(err,hash) =>{
                        //hash password
                        user.password = hash;
                        // save the user
                        try {
                            const newUser = await user.save();
                            res.send(201);
                            next()
                        } catch (err) {
                            return next(new errors.InternalError(err.message));
                        }
                    })
                })
            }
       } catch (err) {
        return next(new errors.UnauthorizedError(err));
       }
    })

    // Auth user
    server.post('/auth', async(req,res,next) =>{
        const {email,password} = req.body;
        try {
            //authenticate the user us the auth
            const user = await auth.authenticate(email,password)

            //create the token
            const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
                expiresIn: '15m'
            });
            const {iat, exp} = jwt.decode(token);
            //respond with token
            res.send({iat,exp,token})
            next();
        } catch (err) {
            //user unauthorise error
            return next(new errors.UnauthorizedError(err));
        }
    })
}