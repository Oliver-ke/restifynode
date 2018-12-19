const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.authenticate = (email, password) =>{
    //  this function is returning a promise
    // the resolve is called when the promise is
    // return while the reject is called when there is an error
    // this is same as the .then and .catch used when utitlizing 
    // any function returning a promise

    return new Promise(async(resolve,reject) =>{
        try {
            //get user by email
            const user = await User.findOne({email});
            //match the password
            bcrypt.compare(password,user.password, (err, isMatch) =>{
                if(err) throw err;
                if(isMatch){
                    resolve(user);
                }else{
                    //Email not found
                    reject('Authentication Failed');
                }

            })
        } catch (err) {
            //email not found
            reject('Authentication failed');
        }
    })
}