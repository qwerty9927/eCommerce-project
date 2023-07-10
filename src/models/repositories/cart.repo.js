const CartModel = require("../cart.model")

const createCart = async (user_id, product) => {
  const newCart = await CartModel.create({
    cart_user_id: user_id,
    cart_product: {
      $push: { "$": product }
    }
  })
  return newCart
}

const updateCart = async (user_id, product) => {
  const { product_id, quantity } = product
  const modifyCart = await CartModel.findOneAndUpdate({
    cart_user_id: user_id,
    "cart_product.product_id": product_id,
    cart_state: "active"
  }, {
    $inc: {
      "cart_product.$.quantity": quantity,
      cart_count_product: quantity
    }
  }, { new: true})
  return modifyCart
}

module.exports = {
  createCart,
  updateCart
}