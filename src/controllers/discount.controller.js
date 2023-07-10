const { SuccessResponse } = require("../core/success.response")
const DiscountService = require("../services/discount.service")

class DiscountController {
  async createDiscount(req, res, next) {
    try {
      new SuccessResponse({
        message: "Create discount success",
        metadata: await DiscountService.createDiscount(req.user.userId, req.body)
      }).send({ res })
    } catch (error) {
      next(error)
    }
  }

  async updateDiscountInActive(req, res, next) {
    try {
      new SuccessResponse({
        message: "Update discount success",
        metadata: await DiscountService.updateDiscountInActive({ discount_id: req.params.discount_id, shop_id: req.user.userId, payload: req.body })
      }).send({ res })
    } catch (error) {
      next(error)
    }
  }

  async updateDiscountActive(req, res, next) {
    try {
      new SuccessResponse({
        message: "Update discount success",
        metadata: await DiscountService.updateDiscountActive({ discount_id: req.params.discount_id, shop_id: req.user.userId, payload: req.body })
      }).send({ res })
    } catch (error) {
      next(error)
    }
  }

  async deleteDiscount(req, res, next) {
    try {
      new SuccessResponse({
        message: "Delete discount success",
        metadata: await DiscountService.deleteDiscount({ discount_id: req.params.discount_id, shop_id: req.user.userId })
      }).send({ res })
    } catch (error) {
      next(error)
    } 
  }

  // guest request
  async getAllDiscount(req, res, next) {
    try {
      new SuccessResponse({
        message: "Get all discount success",
        metadata: await DiscountService.getAllDiscount(req.query, { 
          filter: { 
            discount_shop_id: req.params.shop_id,
            dicount_is_active: true
          } 
        })
      }).send({ res })
    } catch (error) {
      next(error)
    }
  }

  // shop request
  async getAllMyDiscount(req, res, next) {
    try {
      new SuccessResponse({
        message: "Get all discount success",
        metadata: await DiscountService.getAllDiscount(req.query, { 
          select: ["_id", "discount_name", "discount_code", "discount_start_date", "discount_end_date", "discount_is_active"],
          filter: { discount_shop_id: req.user.userId } 
        })
      }).send({ res })
    } catch (error) {
      next(error)
    }
  }

  async getAllProductForDiscountSpecific(req, res, next) {
    try {
      new SuccessResponse({
        message: "Get all product of discount success",
        metadata: await DiscountService.getAllProductForDiscountSpecific(req.query, { 
          discount_id: req.params.discount_id
        })
      }).send({ res })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new DiscountController()