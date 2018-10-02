import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import 'babel-polyfill'


import { greenf, redf, yellow } from '../logger'
import users from '../routes/user-route'
import events from '../routes/events-route'
import images from '../routes/image-route'
import search from '../routes/search-route'
import location from '../routes/location-route'
import starwars from '../routes/starwars-route'

const app = express()
const path = require('path')

// source: https://daveceddia.com/deploy-react-express-app-heroku/

// Serve static files from the React app
const pathToStaticFiles = path.resolve(__dirname, '../client/build')
console.log('static-root:', pathToStaticFiles)
app.use(express.static(path.resolve(__dirname, '../client/build')))

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(pathToStaticFiles, 'index.html'))
// })

const port = process.env.PORT

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

require('../config/passport')
app.use('/', users)
app.use('/events', events)
app.use('/images', images)
app.use('/search', search)
app.use('/location', location)
app.use('/starwars', starwars)
app.get('/', (req, res) => {
  redf('Invalid endpoint!')
  res.send('Invalid endpoint!')
})

// app.listen(port, () => {
//   greenf('server started - ', port)
// })

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Events API server is listening on port ${port}`)
  })
}

module.exports = { app, port }
