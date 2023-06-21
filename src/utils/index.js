const _ = require('lodash')

const getAttributeObject = (object = {}, fields = []) => {
  return _.pick(object, fields)
}

const getSelectData = (data) => {
  return Object.fromEntries(data.map(el => [el, 1]))
}

const unGetSelectData = (data) => {
  return Object.fromEntries(data.map(el => [el, 0]))
}

module.exports = {
  getAttributeObject,
  getSelectData,
  unGetSelectData
}