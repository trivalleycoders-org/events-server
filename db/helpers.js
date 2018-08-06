import { ObjectID } from  'mongodb'
import { omit } from 'ramda'

const isValidObjectID = (id) => {
  return ObjectID.isValid(id)
}

export const objectIdFromHexString = (hexId) => {
  if (isValidObjectID(hexId)) {
    return ObjectID.createFromHexString(hexId)
  } else {
    throw `Invalid objectId: ${hexId}`
  }
}

export const removeIdProp = (obj) => {
  return omit(['_id'], obj)
}


export default { objectIdFromHexString }
