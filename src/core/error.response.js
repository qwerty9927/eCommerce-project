const { ReasonPhrases, StatusCodes } = require("../utils/httpStatusCode")

class ErrorResponse extends Error {
  constructor({message, statusCode, code}){
    super(message)
    this.statusCode = statusCode
    this.code = code
  }
}

class ForbiddenRequest extends ErrorResponse {
  constructor({message = ReasonPhrases.FORBIDDEN, statusCode = StatusCodes.FORBIDDEN, code = StatusCodes.FORBIDDEN}){
    super({message, statusCode, code})
  }
}

class ConflictRequest extends ErrorResponse {
  constructor({message = ReasonPhrases.CONFLICT, statusCode = StatusCodes.CONFLICT, code = StatusCodes.CONFLICT}){
    super({message, statusCode, code})
  }
}

module.exports = {
  ForbiddenRequest,
  ConflictRequest
}