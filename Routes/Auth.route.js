const express = require("express")
const router = express.Router()


router.post('/login', async (req, res, next) => {
    res.send("/login")
})

router.delete('/logout', async (req, res, next) => {
    res.send("/logout")
})

module.exports = router;