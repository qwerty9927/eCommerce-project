const express = require('express')
const ProductController = require('../../controllers/product.controller')
const { authentication } = require('../../auth/checkAuth')
const router = express.Router()

router.get("/search/:keySearch", ProductController.searchProduct)
router.get("/", ProductController.findAllProducts)
router.get("/:product_id", ProductController.findProduct)

// authentication
router.use(authentication)

router.post("/create", ProductController.createProduct)
router.patch("/update/:product_id", ProductController.updateProduct)

module.exports = router