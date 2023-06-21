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

  async searchProduct (req, res, next) {
    try {
      new SuccessResponse({
        message: "Find success",
        metadata: await ProductService.searchProduct(req.params)
      }).send({res})
    } catch(error) {
      next (error)
    }
  }

  async findAllProducts (req, res, next) {
    try {
      new SuccessResponse({
        message: "Find all success",
        metadata: await ProductService.findAllProducts(req.query)
      }).send({res})
    } catch(error) {
      next (error)
    }
  }

  async findProduct (req, res, next) {
    try {
      new SuccessResponse({
        message: "Find success",
        metadata: await ProductService.findProduct(req.params)
      }).send({res})
    } catch(error) {
      next (error)
    }
  }
}

module.exports = new ProductController