const ApiKeyModel = require("../models/apiKey.model")

class ApiKeyService {
  async findByKey(key) {
    // const newApiKey = await ApiKeyModel.create({
    //   key: "123",
    //   permissions: ["0000"]
    // })
    return await ApiKeyModel.findOne({key}).lean()
  }
}

module.exports = new ApiKeyService