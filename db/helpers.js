import { ObjectID } from  'mongodb'
import { omit } from 'ramda'
import { yellow, redf } from '../logger';

const isValidObjectID = (id) => {
  const isValid = ObjectID.isValid(id)
  return isValid
}

export const objectIdFromHexString = (hexId) => {
  yellow('hexId', hexId)
  try {
    return ObjectID.createFromHexString(hexId)
  }
  catch (e) {
    redf('ERROR /db/helpers.js.objectidFromHexString', e)
  }
}

export const removeIdProp = (obj) => {
  return omit(['_id'], obj)
}

export default { objectIdFromHexString }