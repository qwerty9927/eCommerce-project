const { Schema ,model } = require("mongoose")

const DOCUMENT_NAME = "clothing"
const COLLECTION_NAME = "Clothings"

const clothingSchema = new Schema({
  product_shop: { 
    type: Schema.Types.ObjectId,
    ref: "shop"
  },
  product_description: {
    type: String
  },
  brand: {
    type: String,
    required: true
  },
  size: String,
  material: String
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, clothingSchema)
