const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        trim: true,
        createIndexes: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password:{
        type: String,
        required: true
    }
});
const user = mongoose.model('User',UserSchema);
module.exports = user;