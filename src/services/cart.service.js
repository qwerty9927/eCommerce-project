const CartModel = require("../models/cart.model")
const { createCart, updateCart } = require("../models/repositories/cart.repo")

class CartService {

  async addToCart( user_id, product ) {
    const foundCart = await CartModel.findOne({
      cart_user_id: user_id,
      cart_state: "active"
    }).lean()

    if(!foundCart) {
      return await createCart(user_id, product)
    }

    if(!foundCart.cart_count_product) {
      foundCart.cart_product = [product]
      return await foundCart.save()
    }
    return await updateCart(user_id, product)
  }
}

module.exports = new CartService