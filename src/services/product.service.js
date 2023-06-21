const ProductModel = require("../models/product.model")
const ClothingModel = require("../models/clothing.model")
const ElectronicModel = require("../models/electronic.model")
const { ErrorResponse } = require('../core/error.response')
const {
  searchProduct,
  findAllProducts,
  findProduct
} = require("../models/repositories/product.repo")

class ProductFactory {
  static productRegistry = {}
  static registerProduct({ type, classRef }) {
    ProductFactory.productRegistry[type] = classRef
  }

  async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new ErrorResponse(`Invaild product type ${type}`)

    return await new productClass(payload).createProductDetail()
  }

  // async createProduct(type, payload) {
  //   switch (type) {
  //     case "Electronic":
  //       return await new Electronic(payload).createElectronic()
  //     case "Clothing":
  //       return await new Clothing(payload).createClothing()
  //     default:
  //       throw new ErrorResponse(`Invaild product type ${type}`)
  //   }
  // }


  // Start query
  // 1. Search
  async searchProduct({ keySearch }) {
    return await searchProduct(keySearch)
  }
  // 2. findAllProduct
  async findAllProducts({ limit = 10, page = 1, sort = "descending", filter = {}, select = ["product_name", "product_thumb", "product_price"] }) {
    return await findAllProducts({ limit, page, sort, select, filter })
  }
  // 3. findProduct
  async findProduct({ product_id, unSelect = ["__v"] }) {
    return await findProduct({ product_id, unSelect })
  }
  // 4. updateProduct
  // End query

}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_price,
    product_quantity_sold,
    product_type,
    product_shop
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_price = product_price
    this.product_quantity_sold = product_quantity_sold
    this.product_type = product_type
    this.product_shop = product_shop
  }

  async createProduct(product_detail_id) {
    console.log(this)
    return await ProductModel.create({ ...this, _id: product_detail_id })
  }
}

class Clothing extends Product {
  constructor(product) {
    const { product_detail, ...baseInfoProduct } = product
    super(baseInfoProduct)
    this.product_detail = product_detail
  }

  async createProductDetail() {
    const newClothing = await ClothingModel.create(this.product_detail)
    if (!newClothing) throw new ErrorResponse()

    const newProduct = await this.createProduct(newClothing._id)
    if (!newProduct) throw new ErrorResponse()

    return { newProduct, product_detail: newClothing }
  }
}

class Electronic extends Product {

  constructor(product) {
    const { product_detail, ...baseInfoProduct } = product
    super(baseInfoProduct)
    this.product_detail = product_detail
  }

  async createProductDetail() {
    const newElectronic = await ElectronicModel.create(this.product_detail)
    if (!newElectronic) throw new ErrorResponse()

    const newProduct = await this.createProduct(newProduct._id)
    if (!newProduct) throw new ErrorResponse()

    return { newProduct, product_detail: newElectronic }
  }
}

// register area
ProductFactory.registerProduct({ type: "Clothing", classRef: Clothing })
ProductFactory.registerProduct({ type: "Electronic", classRef: Electronic })

module.exports = new ProductFactory