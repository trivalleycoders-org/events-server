import mongoose from 'mongoose'

let postalCodeSchema = new mongoose.Schema({
  postalCode: {
    type: String,
  },
  displayString: {
    type: String
  }
})

const eventSchema = new mongoose.Schema({
  category: {
    type: String,
  },
  free: {
    type: Boolean,
  },
  endDateTime: {
    type: Date,
  },
  imageUrl: {
    type: String,
  },
  linkToUrl: {
    type: String,
  },
  organization: {
    type: String,
  },
  postalCode: {
    type: postalCodeSchema,
  },
  price: {
    type: Number,
  },
  startDateTime: {
    type: Date,
  },
  tags: [],
  title: {
    type: String,
  },
  venueName: {
    type: String,
  },

})

let Event = mongoose.model('Event', eventSchema)


export default Event
