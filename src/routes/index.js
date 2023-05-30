const express = require("express")
const { checkApiKey, checkPermission } = require("../auth/checkAuth")
const router = express.Router()

// check api key
router.use(checkApiKey)

// check permission
router.use(checkPermission("0000"))

// access
router.use("/v1/api/access", require("./access"))

module.exports = router