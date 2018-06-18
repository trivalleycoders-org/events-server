import mongoose from 'mongoose'

let phoneSchema = new mongoose.Schema({
  phoneType: {
    type: String,
    enum: ['Home', 'Work', 'Mobile']
  },
  phoneNumber: {
    type: String
  }
})

const eventSchema = new mongoose.Schema({
  // time: {
  //   type: Date,
  //   required: true,
  //   minlength: 1,
  //   trim: true
  // },
  time: {
    type: String,
  },
  title: {
    type: String,
  },
  venu: {
    type: String,
  },
  imageUrl: {
    type: String,
  },

})

let Event = mongoose.model('Event', eventSchema)


export default Event
