const { CreatedResponse, SuccessResponse } = require("../core/success.response")
const AccessService = require("../services/access.service")
class AccessController{

  async handleRefreshToken(req, res, next) {
    try {
      new SuccessResponse({
        message: "Get token success",
        metadata: await AccessService.handleRefreshToken(req.user, req.keyStore, req.refreshToken)
      }).send({res})
    } catch(error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      new SuccessResponse({
        message: "Login success",
        metadata: await AccessService.login(req.body)
      }).send({res})
    } catch(error) {
      next(error)
    }
  }

  async signUp(req, res, next) {
    try {
      new CreatedResponse({
        message: "Account is created",
        metadata: await AccessService.signUp(req.body)
      }).send({res})
    } catch(error) {
      next(error)
    }
  }

  async logOut(req, res, next) {
    try { 
      new SuccessResponse({
        message: "LogOut success",
        metadata: await AccessService.logOut(req.keyStore.userId)
      }).send({res})
    } catch(error){
      next(error)
    }
  }
}

module.exports = new AccessController