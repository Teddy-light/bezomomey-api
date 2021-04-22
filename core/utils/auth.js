const CryptoJS = require("crypto-js");
const randomBytes = require('random-bytes');
const jsonwebtoken = require('jsonwebtoken');
const env = require('dotenv');


env.config();


const genPassword = (password) => {
    var salt = randomBytes.sync(12)
    var genHash = CryptoJS.AES.encrypt(password, salt.toString()).toString();
    
    return {
      salt: salt,
      hash: genHash
    };
}


const  issueJWT = (user) => {
  const _id = user._id;

  const expiresIn = '1d';

  const payload = {
    sub: _id,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, process.env.PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;