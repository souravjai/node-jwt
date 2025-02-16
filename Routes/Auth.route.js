const express = require("express")
const httpErrors = require('http-errors')
const { asyncHandler } = require('../helpers/globalErrorHandler')
const User = require('../Models/Users.model')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_helper')

const router = express.Router()

router.post('/register', asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw httpErrors.BadRequest()
    }

    const doesUserExists = await User.findOne({ email })

    if (doesUserExists) {
        throw httpErrors.Conflict('User already present')
    }

    const user = new User({ email, password, data: email });
    const savedUser = await user.save();
    const access_token = await signAccessToken(savedUser.id);
    const refresh_token = await signRefreshToken(savedUser.id);
    res.status(201).send({ access_token, refresh_token });
}))

router.post('/refresh-token', asyncHandler(async (req, res, next) => {
    const token = req.body?.refreshToken
    if (!token) {
        throw httpErrors.BadRequest()
    }

    const userID = await verifyRefreshToken(token)
    const access_token = await signAccessToken(userID);
    const refresh_token = await signRefreshToken(userID);
    res.status(200).send({ access_token, refresh_token });

}))


router.post('/login', asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw httpErrors.BadRequest("email/password cannot be empty!")
    }

    const doesUserExists = await User.findOne({ email });

    if (!doesUserExists) {
        throw httpErrors.NotFound('User does not exists')
    }

    const isPasswordMatched = await doesUserExists.isValidPassword(password)
    if (!isPasswordMatched) {
        throw httpErrors.Unauthorized('Username/Password does not match!')
    }

    const accessToken = await signAccessToken(doesUserExists.id);

    res.status(200).send({ accessToken })

}))

router.delete('/logout', async (req, res, next) => {
    res.send("/logout")
})

module.exports = router;