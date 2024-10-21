const JWT = require('jsonwebtoken')

module.exports.signAccessToken = (userID) => {
    return new Promise((resolve, reject) => {
        const payload = {}
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '1h',
            audience: userID
        }

        JWT.sign(payload, secret, options, (err, token) => {
            if (err) {
                return reject(err);
            }
            return resolve(token);
        })
    })
}