const ProductService = require("../services/product.service")
const { SuccessResponse } = require("../core/success.response")

class ProductController {
  async createProduct(req, res, next) {
    try {
      new SuccessResponse({
        message: "Create product success",
        metadata: await ProductService.createProduct(
          req.body.product_type,
          {
            ...req.body,
            product_shop: req.user.userId,
            product_detail: { ...req.body.product_detail, product_shop: req.user.userId }
          }
        )
      }).send({ res })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new ProductController