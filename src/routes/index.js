const express = require("express")
const router = express.Router()

// access
router.use("/v1/api/access", require("./access"))

module.exports = router