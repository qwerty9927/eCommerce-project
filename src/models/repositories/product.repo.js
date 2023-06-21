const ProductModel = require("../product.model")
const { getSelectData, unGetSelectData } = require("../../utils")

const coupleProduct = (general, detail) => {
  return { ...general, product_detail: detail }
}

const searchProduct = async (keySearch) => {
  const regexSearch = new RegExp(keySearch)
  return ProductModel.find({
    $text: { $search: regexSearch }
  }, { score: { $meta: 'textScore' } })
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
  const result = await ProductModel.findById(product_id)
    .populate({
      path: "_id",
      select: unGetSelectData(unSelect)
    })
    .select(unGetSelectData(unSelect))
    .lean()
  const { _id, ...product_detail } = result._id
  return { ...result, _id, product_detail }
}

const updateProductById = async ({ product_id, payload, model, isNew = true }) => {
  return await model.findByIdAndUpdate(product_id, payload, { new: isNew }).lean()
}

module.exports = {
  searchProduct,
  findAllProducts,
  findProduct,
  updateProductById,
  coupleProduct
}