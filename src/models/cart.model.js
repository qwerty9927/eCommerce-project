const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = "Cart"
const COLLECTION_NAME = "Carts"

const cartSchema = Schema({
  cart_state: {
    type: String,
    enum: ["active", "completed", "pendding", "failed"],
    default: "active",
    required: true,
  },
  cart_product: {
    type: Array,
    default: [],
    required: true,
  },
  /**
   * [
   *  {
   *    product_Id
   *    shop_Id
   *    quantity
   *    name
   *    price
   *  }
   * ]
   */
  cart_count_product: {
    type: Number,
    default: 0
  },
  cart_user_id: {
    type: Number,
    required: true
  }
}, {
  collection: COLLECTION_NAME,
  timestamps: true
})

module.exports = model(DOCUMENT_NAME, cartSchema)