const express = require("express")
const httpErrors = require('http-errors')
const { asyncHandler } = require('../helpers/globalErrorHandler')
const User = require('../Models/Users.model')
const { signAccessToken } = require('../helpers/jwt_helper')

const router = express.Router()

router.post('/register',
    asyncHandler(async (req, res, next) => {
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
        res.status(201).send({ access_token });
    }))


router.post('/login', async (req, res, next) => {
    res.send("/login")
})

router.delete('/logout', async (req, res, next) => {
    res.send("/logout")
})

module.exports = router;