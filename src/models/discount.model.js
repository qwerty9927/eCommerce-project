const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = "Discount"
const COLLECTION_NAME = "Discounts"

const discountSchema = new Schema({
  discount_name: { type: String, required: true },
  discount_description: { type: String, required: true },
  discount_type: { type: String, default: "fixed_amount", enum: ["fixed_amount", "percentage"] },
  discount_value: { type: Number, required: true }, // 10.000, 10
  discount_code: { type: String, required: true }, // discount code
  discount_start_date: { type: Date, required: true }, // ngay bat dau
  discount_end_date: { type: Date, required: true }, // ngay ket thuc
  discount_max_uses: { type: Number, required: true }, // so luong discount duoc ap dung
  
  discount_used: { type: Number, default: 0 }, // so luong discount da dung
  discount_users_used: { type: Array, default: [] }, // ai su dung
  
  discount_max_uses_per_user: { type: Number, required: true }, // so luong cho phep toi da dung
  discount_min_order_value: { type: Number, required: true },
  discount_shop_id: { type: Schema.Types.ObjectId, ref: "shop" },
  discount_is_active: { type: Boolean, default: false },
  discount_applies_to: { type: String, required: true, enum: ["all", "specific"] },
  discount_product_ids: { type: Array, default: [] } // san pham duoc ap dung
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, discountSchema)
