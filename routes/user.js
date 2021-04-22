const router = require('express').Router();
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');


router.post('/register', function (req, res, next) {
    User.findOne({username: req.body.username})
        .then((user => {
            if (!user) {
                const saltHash = utils.genPassword(req.body.password);
                const salt = saltHash.salt;
                const hash = saltHash.hash;

                const newUser = new User({
                    username: req.body.username,
                    hash: hash,
                    salt: salt
                });

                newUser.save()
                    .then((user) => {
                        const jwt = utils.issueJWT(user);

                        res.json({success: true, user: user, token: jwt.token, expiresIn: jwt.expires});
                    })
                    .catch(err => next(err));
            } else {
                res.status(401).json({success: false, msg: "user already exist"});
            }
        }))
        .catch(err => next(err));
});