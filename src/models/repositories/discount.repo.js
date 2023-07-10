const { getSelectData } = require('../../utils')
const DiscountModel = require('../discount.model')

const findAllDiscount = async ({ limit, sort, page, select, filter }) => {
  const skip = (page - 1) * limit
  const sortBy = sort === "ascending" ? { _id: 1 } : { _id: -1 }
  return await DiscountModel.find(filter)
  .sort(sortBy)
  .select(getSelectData(select))
  .skip(skip)
  .limit(limit)
  .lean()
}

module.exports = {
  findAllDiscount
}