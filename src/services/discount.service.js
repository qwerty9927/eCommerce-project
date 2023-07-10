const DiscountModel = require("../models/discount.model")
const { ErrorResponse, NotFoundRequest } = require("../core/error.response")
const { removeUndefineObject } = require("../utils")
const { findAllDiscount } = require("../models/repositories/discount.repo")
const { findAllProducts } = require("../models/repositories/product.repo")

class DiscountService {

  // create discount
  async createDiscount(shop_id, payload) {
    const {
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_max_uses,
      discount_max_uses_per_user,
      discount_min_order_value,
      discount_is_active,
      discount_applies_to,
      discount_product_ids
    } = payload

    // check time
    if (new Date() > new Date(discount_start_date)) {
      throw new ErrorResponse("Start date invalid")
    }

    if (new Date(discount_start_date) >= new Date(discount_end_date)) {
      throw new ErrorResponse("Start date must be before end date")
    }

    // discount is exsist ?
    const foundDiscount = await DiscountModel.findOne({
      discount_code,
      discount_shop_id: shop_id
    }).lean()

    if (foundDiscount) {
      throw new ErrorResponse("Discount code is exsisted!")
    }

    // create discount
    const newDiscount = await DiscountModel.create({
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_max_uses,
      discount_max_uses_per_user,
      discount_min_order_value,
      discount_shop_id: shop_id,
      discount_is_active,
      discount_applies_to,
      discount_product_ids
    })

    if (!newDiscount) {
      throw new ErrorResponse("Create failed")
    }
    return newDiscount
  }

  // update discount
  // start_date <= now date. This can't change
  /*
    name, description, code, max_uses, max_uses_per_user, type, value, start_date, end_date, min_order_value, applies_to, product_ids can be changed
    if is_active === true then  discount_name, discount_description, discount_code,discount_max_uses, discount_max_uses_per_user
  */
  // update if is_active === false
  async updateDiscountInActive({ discount_id, shop_id, payload }) {
    const {
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_max_uses,
      discount_max_uses_per_user,
      discount_min_order_value,
      discount_is_active,
      discount_applies_to,
      discount_product_ids
    } = removeUndefineObject(payload)

    const foundDiscount = await DiscountModel.findOne({
      _id: discount_id,
      discount_shop_id: shop_id
    }).lean()

    if (!foundDiscount) {
      throw new ErrorResponse("Not found discount!")
    }

    // check active
    if (foundDiscount.discount_is_active) {
      throw new ErrorResponse("Can not update from this route!")
    }

    // check time
    console.log(new Date(discount_start_date), ":::", new Date(discount_end_date))
    if (new Date() > new Date(discount_start_date)) {
      throw new ErrorResponse("Start date invalid")
    }

    if (new Date(discount_start_date) >= new Date(discount_end_date)) {
      throw new ErrorResponse("Start date must be before end date")
    }

    const discount = await DiscountModel.findByIdAndUpdate(
      discount_id, {
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_max_uses,
      discount_max_uses_per_user,
      discount_min_order_value,
      discount_is_active,
      discount_applies_to,
      discount_product_ids
    }, { new: true }).lean()

    if (!discount) {
      throw new ErrorResponse("Update failed!")
    }

    return discount
  }

  // update if is_active === true
  async updateDiscountActive({ discount_id, shop_id, payload }) {
    const {
      discount_name,
      discount_description,
      discount_code,
      discount_max_uses,
      discount_max_uses_per_user
    } = removeUndefineObject(payload)

    const foundDiscount = await DiscountModel.findOne({
      _id: discount_id,
      discount_shop_id: shop_id
    }).lean()

    if (!foundDiscount) {
      throw new ErrorResponse("Not found discount!")
    }

    // check event is started ?
    if (new Date(foundDiscount.discount_start_date) <= new Date()) {
      throw new ErrorResponse("Discount is started. Can not change!")
    }

    const discount = await DiscountModel.findByIdAndUpdate(
      discount_id, {
      discount_name,
      discount_description,
      discount_code,
      discount_max_uses,
      discount_max_uses_per_user
    }, { new: true }).lean()

    if (!discount) {
      throw new ErrorResponse("Update failed!")
    }

    return discount
  }

  // delete discount
  async deleteDiscount({ discount_id, shop_id }) {

    const foundDiscount = await DiscountModel.findOne({
      _id: discount_id,
      discount_shop_id: shop_id
    }).lean()

    if (!foundDiscount) {
      throw new ErrorResponse("Not found discount!")
    }

    // check time start
    if (new Date(foundDiscount.discount_start_date) <= new Date()) {
      throw new ErrorResponse("Can not delete discount")
    }

    const discount = await DiscountModel.findByIdAndDelete(discount_id).lean()

    if (!discount) {
      throw new ErrorResponse("Delete failed!")
    }

    return discount
  }

  // get all discount codes available
  async getAllDiscount({
    limit = 10,
    page = 1,
    sort = "ascending"
  }, {
    select = ["_id", "discount_name", "discount_code", "discount_start_date", "discount_end_date"],
    filter = {},
  }) {
    const foundDiscount = await findAllDiscount({ limit, page, sort, select, filter })
    if (!foundDiscount.length) {
      throw new NotFoundRequest("Discount of shop not found!")
    }
    return foundDiscount
  }

  // get all product for discount specific
  async getAllProductForDiscountSpecific({
    limit = 10,
    page = 1,
    sort = "ascending"
  }, { 
    select = ["_id", "product_name", "product_thumb", "product_price"],
    discount_id 
  }) {
    const foundDiscount = await DiscountModel.findOne({ _id: discount_id }).lean()

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundRequest("Discount not found!")
    }

    if (foundDiscount.discount_type === "all") {
      return await findAllProducts({ limit, page, sort, select })
    } else {
      return await findAllProducts({
        limit, page, sort, select, filter: {
          _id: { $in: discount_product_ids }
        }
      })
    }
  }
}

module.exports = new DiscountService()