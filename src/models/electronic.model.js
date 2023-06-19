const { Schema ,model } = require("mongoose")

const DOCUMENT_NAME = "electronic"
const COLLECTION_NAME = "Electronics"

const electronicSchema = new Schema({
  product_shop: { 
    type: Schema.Types.ObjectId,
    ref: "shop"
  },
  product_description: {
    type: String
  },
  manufacturer: {
    type: String,
    required: true
  },
  model: String,
  color: String
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, electronicSchema)