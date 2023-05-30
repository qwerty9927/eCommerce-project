const jwt = require("jsonwebtoken")
const { Header } = require("../constance/access.constance")
const ApiKeyService = require('../services/apiKey.service')
const KeyTokenService = require("../services/keyToken.service")
const { ForbiddenRequest, AuthFailureRequest } = require("../core/error.response")
const { verifyJwt } = require("./authUtil")

const checkApiKey = async (req, res, next) => {
  const key = req.headers[Header.API_KEY]
  if(!key) return next(new ForbiddenRequest())

  const objKey = await ApiKeyService.findByKey(key)
  if(!objKey) return next(new ForbiddenRequest())
  req.objKey = objKey
  next()
}

const checkPermission = (permission) => {
 return (req, res, next) => {
  if(!req.objKey.permissions.includes(permission)){
    return next(new ForbiddenRequest())
  }
  next()
 }
}

const authentication = async (req, res, next) => {
  const userId = req.headers[Header.CLIENT_ID]
  if(!userId) return next(new AuthFailureRequest())

  const accessToken = req.headers[Header.AUTHORIZATION]
  if(!accessToken) return next(new AuthFailureRequest())
  
  const keyStore = await KeyTokenService.findById(userId)
  if(!keyStore) return next(new AuthFailureRequest("Invalid UserID"))
  
  const refreshToken = req.headers[Header.REFRESHTOKEN]
  if(refreshToken){
    try {
      const {userId, email} = verifyJwt(refreshToken, keyStore.refreshKey)
      req.user = {userId, email}
      req.keyStore = keyStore
      req.refreshToken = refreshToken
      next()
    } catch(error) {
      next(new ForbiddenRequest("False token 1"))
    }
  } else {
    try {
      const {userId, email} = verifyJwt(accessToken, keyStore.accessKey)
      req.user = {userId, email}
      req.keyStore = keyStore
      next()
    } catch(error) {
      next(new ForbiddenRequest("False token 2"))
    }
  }
}

module.exports = {
  checkApiKey,
  checkPermission,
  authentication
}