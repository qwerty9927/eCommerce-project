const { ReasonPhrases, StatusCodes } = require("../utils/httpStatusCode")

class SuccessResponse {
  constructor({ message, statusCode, code, metadata }) {
    this.statusCode = statusCode
    this.payload = {
      code,
      message,
      metadata
    }
  }

  send({ res, header = {} }) {
    return res.status(this.statusCode).json(this.payload)
  }
}

class Ok extends SuccessResponse {
  constructor({ message = ReasonPhrases.OK, statusCode = StatusCodes.OK, code = StatusCodes.OK, metadata = {} }) {
    super({ message, statusCode, code, metadata })
  }
}

class Created extends SuccessResponse {
  constructor({ message = ReasonPhrases.CREATED, statusCode = StatusCodes.CREATED, code = StatusCodes.CREATED, metadata = {} }) {
    super({ message, statusCode, code, metadata })
  }
}

module.exports = { 
  Ok,
  Created
}