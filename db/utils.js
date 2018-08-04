import { ObjectID } from  'mongodb'

export const isValidObjectID = (id) => {
  return ObjectID.isValid(id)
}

export const objectIdFromHexString = (hexId) => {
  return ObjectID.createFromHexString(hexId)
}

export default { isValidObjectID }
