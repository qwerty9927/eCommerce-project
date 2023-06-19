const express = require('express')
const ProductController = require('../../controllers/product.controller')
const { authentication } = require('../../auth/checkAuth')
const router = express.Router()

// authentication
router.use(authentication)

router.post("/create", ProductController.createProduct)

module.exports = router