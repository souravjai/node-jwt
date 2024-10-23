const httpErrors = require('http-errors');
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
                console.log(err);
                reject(httpErrors.InternalServerError());
            }
            return resolve(token);
        })
    })
}

module.exports.verifyAccessToken = (req, res, next) => {

    if (!req.headers['authorization']) {
        return next(httpErrors.Unauthorized())
    }

    const auth = req.headers['authorization']
    const token = auth.split(" ")[1]

    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
        if (err) {
            const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
            return next(httpErrors.Unauthorized(message))
        }
        req.payload = payload;
        return next()
    })
}