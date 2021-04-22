const  userDao = require("../core/dao/user");
const mongoose = require('mongoose');
// const User = mongoose.model('User');

jest.mock('mongoose')

test("should save user", async () => {

    const saveUser = () => {
        return {phoneNumber: '123456', hash: 'mhash', salt: 'msalt'};
    } 
    mongoose.model.mockResolvedValue(saveUser)

   const user = {phoneNumber: '123456', hash: 'mhash', salt: 'msalt'}
   const savedUser  =  await userDao.saveUser(user);
   expect(savedUser).toEqual(user)
})