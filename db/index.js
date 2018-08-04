import Mongoose from 'mongoose'
import { yellowf, greenf, redf, yellow } from '../logger'
Mongoose.Promise = global.Promise
import { dropCollection, find, insert } from './dbFunctions'

const readyState = () => {
  const state = Mongoose.connection.readyState
  switch (state) {
    case 0:
      yellowf('Mongoose: not connected')
      return
    case 1:
      greenf('Mongoose: connected')
      return
    case 2:
      yellowf('Mongoose: connecting')
      return
    case 3:
      yellowf('Mongoose: disconnecting')
      return
    default:
      redf('Mongoose: state unknown')
  }
}

const connectToMongo = () => {
    readyState()
    // await Mongoose.connect(process.env.MONGODB_URI)
    // yellow('URI', process.env.MONGODB_URI)
    Mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      readyState()
      greenf('Connected to mongo!!!')
    })
    .catch((e) => {
      readyState()
      redf('Could not connect to MongoDB', e)
    })

}

export { connectToMongo, dropCollection, find, insert }


