const ProductModel = require("../models/product.model")
const ClothingModel = require("../models/clothing.model")
const ElectronicModel = require("../models/electronic.model")
const { ErrorResponse } = require('../core/error.response')
const {
  searchProduct,
  findAllProducts,
  findProduct,
  updateProductById,
  coupleProduct
} = require("../models/repositories/product.repo")
const {
  inserInventory
} = require("../models/repositories/inventory.repo")
const { removeUndefineObject } = require("../utils")

class ProductFactory {
  static productRegistry = {}
  static registerProduct({ type, classRef }) {
    ProductFactory.productRegistry[type] = classRef
  }

  async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new ErrorResponse(`Invaild product type ${type}`)

    return await new productClass(payload).createProduct()
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
  async findProduct({ product_id, unSelect = ["__v", "createdAt", "updatedAt"] }) {
    return await findProduct({ product_id, unSelect })
  }
  // 4. updateProduct
  async updateProduct({ product_id, type, payload }) {
    const productClass = ProductFactory.productRegistry[type]
    if (!productClass) throw new ErrorResponse()

    return await new productClass(removeUndefineObject(payload)).updateProduct(product_id)
  }
  // End query

}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_price,
    product_quantity_sold,
    product_quantity,
    product_type,
    product_shop
  }) {
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_price = product_price
    this.product_quantity_sold = product_quantity_sold
    this.product_quantity = product_quantity
    this.product_type = product_type
    this.product_shop = product_shop
  }

  async createProduct() {
    const product = await ProductModel.create({ ...this })
    if(product) {
      await inserInventory({
        inven_product_id: product._id,
        inven_shop: product.product_shop,
        inven_stock: product.product_quantity
      })
    }
    return product
  }

  async updateProduct(product_id) {
    return await updateProductById({ product_id, payload: this, model: ProductModel })
  }
}

class Clothing extends Product {
  constructor(product) {
    const { product_detail, ...baseInfoProduct } = product
    super(baseInfoProduct)
    this.product_detail = product_detail
  }

  async createProduct() {
    const newProduct = await super.createProduct()
    if (!newProduct) throw new ErrorResponse()

    const newClothing = await ClothingModel.create({ ...this.product_detail, _id: newProduct._id })
    if (!newClothing) throw new ErrorResponse()

    return coupleProduct(newProduct._doc, newClothing)
  }

  async updateProduct(product_id) {
    let productInfoGeneral, productDetail
    if(this.product_detail){
      productDetail = await updateProductById({ product_id, payload: this.product_detail, model: ClothingModel })
    }
    productInfoGeneral = await super.updateProduct(product_id)
    return coupleProduct(productInfoGeneral, productDetail)
  }
}

class Electronic extends Product {

  constructor(product) {
    const { product_detail, ...baseInfoProduct } = product
    super(baseInfoProduct)
    this.product_detail = product_detail
  }

  async createProduct() {
    const newProduct = await super.createProduct()
    if (!newProduct) throw new ErrorResponse()

    const newElectronic = await ElectronicModel.create({ ...this.product_detail, _id: newProduct._id })
    if (!newElectronic) throw new ErrorResponse()

    return coupleProduct(newProduct._doc, newElectronic)
  }
}

// register area
ProductFactory.registerProduct({ type: "clothing", classRef: Clothing })
ProductFactory.registerProduct({ type: "electronic", classRef: Electronic })

module.exports = new ProductFactory