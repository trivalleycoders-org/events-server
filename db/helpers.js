import { ObjectID } from  'mongodb'

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


export default { objectIdFromHexString }
