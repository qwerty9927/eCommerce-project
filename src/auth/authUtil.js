const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const createKeyPair = () => {
  const accessKey = crypto.randomBytes(64).toString("hex")
  const refreshKey = crypto.randomBytes(64).toString("hex")
  
  return {
    accessKey,
    refreshKey
  }
}

const createTokenPair = (payload, accessKey, refreshKey) => {
  const accessToken = jwt.sign(payload, accessKey, {
    expiresIn: "2 days"
  })
  const refreshToken = jwt.sign(payload, refreshKey, {
    expiresIn: "7 days"
  })
  return {
    accessToken,
    refreshToken
  }
}

const verifyJwt = (token, keySecret) => {
  try {
    return jwt.verify(token, keySecret)
  } catch(error) {
    throw error
  }
}

module.exports = {
  createKeyPair,
  createTokenPair,
  verifyJwt
}