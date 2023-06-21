const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "product"
const COLLECTION_NAME = "Products"

const productSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    unique: true,
    refPath: "product_type",
    auto: true
  },
  product_name: {
    type: String,
    required: true
  },
  product_thumb: {
    type: String,
    required: true
  },
  product_price: {
    type: String,
    required: true
  },
  product_quantity_sold: {
    type: String,
    required: true
  },
  product_type: {
    type: String,
    enum: ["electronic", "clothing"],
    required: true
  },
  product_shop: { 
    type: Schema.Types.ObjectId,
    ref: "shop"
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

// create index for search
productSchema.index({ product_name: 'text' })

module.exports = model(DOCUMENT_NAME, productSchema)