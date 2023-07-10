const _ = require('lodash')
const { Types } = require('mongoose')

const convertToObjectId = id => Types.ObjectId(id)

const getAttributeObject = (object = {}, fields = []) => {
  return _.pick(object, fields)
}

const getSelectData = (data) => {
  return Object.fromEntries(data.map(el => [el, 1]))
}

const unGetSelectData = (data) => {
  return Object.fromEntries(data.map(el => [el, 0]))
}

// loai bo nhung thuoc tinh null
const removeUndefineObject = (obj) => {
  Object.keys(obj).forEach(key => {
    if(obj[key] === null) {
      delete obj[key]
    }
    if(typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      removeUndefineObject(obj[key])
    }
  })
  return obj
}

// giu lai nhung thuoc tinh trong object long nhau
/**
 * {
 *   a: "abcde",
 *   b: 2342,
 *   c: {
 *     d: "adfer",
 *     e: 1234
 *   }
 * }
 * ==========> 
 * {
 *    a: "abcde",
 *    b: 2342,
 *    c.d: "adfer",
 *    c.e: 1234
 * }
 */
const updateNestedObjectParser = (data) => {
  const final = {}
  Object.keys(data).forEach( key => {
    if(typeof data[key] === "object" && !Array.isArray(data[key])) {
      const response = updateNestedObjectParser(data[key])
      Object.keys(response).forEach(a => {
        final[`${key}.${a}`] = response
      })
    } else {
      final[key] = data[key]
    }
  })
  return final
}

module.exports = {
  convertToObjectId,
  getAttributeObject,
  getSelectData,
  unGetSelectData,
  removeUndefineObject,
  updateNestedObjectParser
}