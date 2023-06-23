const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = "Inventory"
const COLLECTION_NAME = "Inventorys"

const inventorySchema = new Schema({
  inven_product_id: {
    type: Schema.Types.ObjectId,
    ref: "product",
    required: true
  },
  inven_location: {
    type: String,
    default: "unKnow"
  },
  inven_stock: {
    type: Number,
    required: true
  },
  inven_shop: {
    type: Schema.Types.ObjectId,
    ref: "shop",
    required: true
  },
  inven_reservation: {
    type: Array,
    default: []
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, inventorySchema)