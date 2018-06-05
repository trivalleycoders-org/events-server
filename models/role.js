import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  }
})

let Role = mongoose.model('Role', roleSchema)



export default Role
