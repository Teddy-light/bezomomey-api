const router = require('express').Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const auth = require('../core/utils/auth');


router.post('/register', (req, res, next) => {
    User.findOne({username: req.body.phonenumber})
        .then((user => {
            if (!user) {
                const saltHash = auth.genPassword(req.body.password);
                const salt = saltHash.salt;
                const hash = saltHash.hash;
                const newUser = new User({
                    phonenumber: req.body.phonenumber,
                    hash: hash,
                    salt: salt
                });

                newUser.save()
                    .then((user) => {
                        const jwt = auth.issueJWT(user);
                        res.json({success: true, user: user, token: jwt.token, expiresIn: jwt.expires});
                    })
                    .catch(err => next(err));
            } else {
                res.status(401).json({success: false, msg: "user already exist"});
            }
        }))
        .catch(err => next(err));
});

module.exports = router;