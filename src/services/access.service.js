const bcrypt = require("bcrypt")
const ShopService = require("./shop.services")
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, createKeyPair } = require("../auth/authUtil")
const { getAttributeObject } = require("../utils")
const { RoleShop } = require("../constance/access.constance")
const { ErrorResponse, ConflictRequest, AuthFailureRequest, ForbiddenRequest } = require("../core/error.response")

class AccessService {

  // handle refresh token expire
  async handleRefreshToken(user, keyStore, refreshToken) {

    // check token is used ?
    // token is re use
    if(keyStore.refreshTokenUsed.includes(refreshToken)){
      await KeyTokenService.removeKeyToken(user.userId)
      throw new ForbiddenRequest("Something wrong happend !! Ple relogin")
    }

    // token is newest
    // create new token
    const tokens = createTokenPair(user, keyStore.accessKey, keyStore.refreshKey)
    
    // update new refreshToken
    const updKey = await KeyTokenService.updateKeyToken(user.userId, tokens.refreshToken, refreshToken)
    if(updKey.modifiedCount === 0) throw new ErrorResponse()

    // response
    return tokens
  }

  async login({ email, password }) {
    // check email
    const shop = await ShopService.findByEmail({ email })
    if (!shop) throw new AuthFailureRequest()

    // match password
    const isValid = await bcrypt.compare(password, shop.password)
    if (!isValid) throw new AuthFailureRequest()

    // create aK, rK and generate token
    const tokens = await this.getAuthenticationToken(shop._id, shop.email)

    // response
    return {
      shop: getAttributeObject(shop, ["_id", "name", "email"]),
      tokens
    }
  }

  async signUp({ name, email, password }) {
    // check email
    const holderShop = await ShopService.findByEmail({ email })
    if (holderShop) throw new ConflictRequest()

    // hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // create shop
    const newShop = await ShopService.createShop({ name, email, password: passwordHash, roles: [RoleShop.SHOP] })
    if (!newShop) throw new ErrorResponse()

    // set up interaction
    const tokens = await this.getAuthenticationToken(newShop._id, email)

    // response
    return {
      shop: getAttributeObject(newShop, ["_id", "name", "email"]),
      tokens
    }
  }

  async logOut(userId){
    const delKey = await KeyTokenService.removeKeyToken(userId)
    if(delKey.deletedCount === 0) throw new ErrorResponse()
    return delKey
  }

  async getAuthenticationToken(userId, email) {
    const { accessKey, refreshKey } = createKeyPair()
    const tokens = createTokenPair({userId, email}, accessKey, refreshKey )
    const newKeyToken = await KeyTokenService.createKeyToken({ userId, accessKey, refreshKey, refreshToken: tokens.refreshToken })
    if (!newKeyToken) throw new ErrorResponse()
    return tokens
  }
}

module.exports = new AccessService