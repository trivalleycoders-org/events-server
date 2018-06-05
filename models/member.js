import mongoose from 'mongoose'

// let roleSchema = new mongoose.Schema({
//   name: {
//     name: String,
//     required: true,
//   },
//   avoid: {
//     type: Boolean,
//     default: false,
//   }
// })

let phoneSchema = new mongoose.Schema({
  phoneType: {
    type: String,
    enum: ['Home', 'Work', 'Mobile']
  },
  phoneNumber: {
    type: String
  }
})

const memberSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  comments: {
    type: String
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  exempt: {
    type: Boolean,
    default: false
  },
  phones: [phoneSchema],
  roles: [],
})

let Member = mongoose.model('Member', memberSchema)


export default Member
