const KeyTokenModel = require("../models/keyToken.model")

class KeyTokenService {
  async createKeyToken({ userId, accessKey, refreshKey, refreshToken }) {
    const filter = { userId },
    update = {
      accessKey,
      refreshKey,
      refreshToken,
      refreshTokenUsed: []
    },
    options = {
      upsert: true,
      new: true
    }
    return await KeyTokenModel.findOneAndUpdate(filter, update, options)
  }

  async findById(userId) {
    return await KeyTokenModel.findOne({ userId }).lean()
  }

  async removeKeyToken(userId) {
    return await KeyTokenModel.deleteOne({ userId })
  }

  async findByRefreshTokenUsed(refreshToken) {
    return await KeyTokenModel.findOne({ refreshTokenUsed: refreshToken }).lean()
  }

  async findByRefreshToken(refreshToken) {
    return await KeyTokenModel.findOne({ refreshToken }).lean()
  }

  async updateKeyToken(userId, refreshToken, refreshTokenUsed) {
    return await KeyTokenModel.updateOne({ userId }, {
      $set: {
        refreshToken
      },
      $addToSet: {
        refreshTokenUsed
      }
    })
  }
}

module.exports = new KeyTokenService