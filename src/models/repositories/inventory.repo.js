const InventoryModel = require("../inventory.model")

const inserInventory = async ({ inven_product_id, inven_shop, inven_stock, inven_location = "unKnow" }) => {
  return await InventoryModel.create({
    inven_product_id,
    inven_stock,
    inven_shop,
    inven_location
  })
}

module.exports = {
  inserInventory
}