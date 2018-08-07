import { dbName, mongoUrl } from './config'
import { objectIdFromHexString, removeIdProp } from './helpers'
/* Dev */
import { yellow, redf } from '../logger'

const MongoClient = require('mongodb').MongoClient

const returnError = (e) => {
  return { data: [], meta: { error: e.message }}

}

export const dropCollection = async (collection) => {
  try {
    const client = await MongoClient.connect(mongoUrl)
    const db = await client.db(dbName)
    const ret = await db.collection(collection).drop()
    // yellow('dbFunctions.dropCollection: ret', ret)
    return ret
  }
  catch (e) {
    if (e.message = 'ns not found') {
      return true
    } else {
      redf('ERROR: dbFunctions.dropCollection', e.message)
      return returnError(e)
    }

  }
}

export const find = async (collection, query = {}, project = {}) => {
  try {
    const client = await MongoClient.connect(mongoUrl)
    const db = await client.db(dbName)
    const ret = await db.collection(collection).find(query).project(project).toArray()
    // yellow('ret', ret)
    return { data: ret, meta: {} }
  }
  catch (e) {
    redf('ERROR: dbFunctions.find', e.message)
    return returnError(e)
  }

}

export const findById = async (collection, id, project = {}) => {
  // yellow('id', id)
  try {
    const objId = typeof id === 'object' ? id : objectIdFromHexString(id)
    const client = await MongoClient.connect(mongoUrl)
    const db = await client.db(dbName)
    const ret = await db.collection(collection).find({ _id: objId }).project(project).toArray()
    yellow('ret', ret)
    return { data: ret, meta: {} }
  }
  catch (e) {
    redf('ERROR: dbFunctions.findById', e.message)
    return returnError(e)
  }

}

/*
    UNTESTED
*/
export const findOneAndDelete = async (collection, id) => {
  // yellow('id', id)
  try {
    const objId = objectIdFromHexString(id)
    const client = await MongoClient.connect(mongoUrl)
    const db = await client.db(dbName)
    const ret = await db.collection(collection).findOneAndDelete({ _id: objId })
    // yellow('ret', ret)
    return ret
  }
  catch (e) {
    redf('ERROR: dbFunctions.findOneAndDelete', e.message)
    return returnError(e)
  }
}

export const findOneAndUpdate = async ( collection, id, filter, returnOriginal = false ) => {
  try {
    // if the filter has the _id prop, remove it
    const cleanFilter = removeIdProp(filter)
    const objId = objectIdFromHexString(id)
    const client = await MongoClient.connect(mongoUrl)
    const db = await client.db(dbName)
    const ret = await db.collection(collection).findOneAndUpdate(
      { _id: objId},
      // { organization: 'BRIIA'},
      { $set: cleanFilter },
      { returnOriginal: returnOriginal }
    )
    return ret
  }
  catch (e) {
    redf('ERROR: dbFunctions.findOneAndUpdate', e)
    return returnError(e)
  }
}

export const insertOne = async (collection, data) => {
  // yellow('insertOne: collection', collection)
  // yellow('insertOne: data', data)
  // yellow('insertOne: mongoUrl', mongoUrl)
  // yellow('insertOne: dbName', dbName)
  try {
    const client = await MongoClient.connect(mongoUrl)
    const db = await client.db(dbName)
    const ret = await db.collection(collection).insertOne(data)
    return { data: ret.ops, meta: { n: 1 } }
  }
  catch (e) {
    redf('ERROR: dbFunctions.insert', e.message)
    return returnError(e)
  }

}

export const insertMany = async (collection, data) => {
  try {
    const client = await MongoClient.connect(mongoUrl)
    const db = await client.db(dbName)
    const ret = await db.collection(collection).insertMany(data)
    return { data: ret.ops, meta: { n: 1 } }
  }
  catch (e) {
    redf('ERROR: dbFunctions.insert', e.message)
    return returnError(e)
  }
}