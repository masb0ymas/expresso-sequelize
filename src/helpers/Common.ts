/* eslint-disable no-unused-vars */
import fs from 'fs'
import db from 'models/_instance'
import { FilterAttributes } from 'models'

const { Sequelize } = db
const { Op } = Sequelize
const invalidValues = [null, undefined, '', false, 0]

// Generate Unique Code ( default length 32 )
function getUniqueCodev2(length = 32) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// Filter Query Object
function filterQueryObject(filtered: FilterAttributes[]) {
  const resultObject = {}
  if (typeof filtered !== 'object') {
    throw new Error(`Filtered must be an object, expected ${typeof filtered}`)
  }

  for (let i = 0; i < filtered.length; i += 1) {
    // eslint-disable-next-line prefer-const
    let { id, value } = filtered[i]
    if (id.split('.').length > 1) {
      id = `$${id}$`
    }
    // @ts-ignore
    resultObject[id] = { [Op.like]: `%${value}%` }
  }

  return resultObject
}

// Read HTML File
function readHTMLFile(path: any, callback: any) {
  fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
    if (err) {
      callback(err)
    } else {
      callback(null, html)
    }
  })
}

export { getUniqueCodev2, readHTMLFile, filterQueryObject, invalidValues }
