const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    phonenumber: String,
    hash: String,
    salt: String
}, {timestamps: true});

mongoose.model('User', UserSchema);