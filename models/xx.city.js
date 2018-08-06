import mongoose from 'mongoose'

const citySchema = new mongoose.Schema({
  postalCode: String,
  cityName: String,
  stateCode: String,
  
})

let City = mongoose.model('City', citySchema)


export default City
