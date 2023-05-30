const shopModel = require("../models/shop.model")

class ShopService {
  async findByEmail({email, select = {}}) {
    return await shopModel.findOne({ email }, select).lean()
  }

  async createShop(shop) {
    return await shopModel.create(shop)
  }
} 

module.exports = new ShopService