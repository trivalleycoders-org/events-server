import mongoose from 'mongoose'

const postalCodeSchema = new mongoose.Schema({
  postalCode: {
    type: String,
  },
  cityName: {
    type: String,
  },
  stateCode: {
    type: String,
  },
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
})

let PostalCode = mongoose.model('PostalCode', postalCodeSchema)

export default PostalCode

