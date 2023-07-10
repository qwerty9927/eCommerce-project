const express = require('express')
const DiscountController = require('../../controllers/discount.controller')
const { authentication } = require('../../auth/checkAuth')
const router = express.Router()

router.get("/:shop_id", DiscountController.getAllDiscount)

// middleWare
// authentication
router.use(authentication)

router.post("/create", DiscountController.createDiscount)
router.patch("/update/inactive/:discount_id", DiscountController.updateDiscountInActive)
router.patch("/update/active/:discount_id", DiscountController.updateDiscountActive)
router.delete("/delete/:discount_id", DiscountController.deleteDiscount)
router.get("/", DiscountController.getAllMyDiscount)


module.exports = router