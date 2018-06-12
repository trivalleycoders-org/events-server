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
  image: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  // comments: {
  //   type: String
  // },
  // email: {
  //   type: String,
  //   required: true,
  //   minlength: 1,
  //   trim: true
  // },
  // exempt: {
  //   type: Boolean,
  //   default: false
  // },
  // phones: [phoneSchema],
  // roles: [],
})

let Event = mongoose.model('Member', memberSchema)


export default Event
