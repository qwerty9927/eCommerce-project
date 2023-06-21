const ProductModel = require("../product.model")
const { getSelectData, unGetSelectData } = require("../../utils")

const searchProduct = async (keySearch) => {
  const regexSearch = new RegExp(keySearch)
  return ProductModel.find({
    $text: { $search: regexSearch}
  }, { score: { $meta: 'textScore' }})
  .lean()
}

const findAllProducts = async ({ limit, page, sort, select, filter }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === "ascending" ? { "_id": 1 } : { "_id": -1 }
  return await ProductModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
}

const findProduct = async ({ product_id, unSelect }) => {
  return await ProductModel.findById(product_id)
    .select(unGetSelectData(unSelect))
    .lean()
}

module.exports = {
  searchProduct,
  findAllProducts,
  findProduct
}