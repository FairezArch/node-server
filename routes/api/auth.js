const express = require('express')
const router = express.Router()
const verifyToken = require('../../middleware/verifyJWT')
const AuthController = require('../../app/Controllers/AuthController')
    // const cookies = require("cookie-parser");

router.post('/register', AuthController.register)
router.post('/login', AuthController.login)

// router.use(cookies())
router.get('/logout', verifyToken, AuthController.logout)

module.exports = router
