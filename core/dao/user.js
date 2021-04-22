const mongoose = require('mongoose');
const User = mongoose.model('User');


const saveUser = async ({phoneNumber, hash, salt}) => {
    const user = new User({phoneNumber, hash, salt});
    return await user.save();
}

