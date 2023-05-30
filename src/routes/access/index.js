const express = require("express")
const AccessController = require("../../controllers/access.controller")
const { authentication } = require("../../auth/checkAuth")
const router = express.Router()

// signUp
router.post("/signup", AccessController.signUp)

// login
router.post("/login", AccessController.login)

// authentication
router.use(authentication)

// logOut
router.get("/logout", AccessController.logOut)

// refreshToken
router.get("/refreshtoken", AccessController.handleRefreshToken)

module.exports = router