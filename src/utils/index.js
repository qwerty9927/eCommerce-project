const _ = require('lodash')

const getAttributeObject = (object = {}, fields = []) => {
  return _.pick(object, fields)
}

module.exports = {
  getAttributeObject
}