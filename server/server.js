import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import 'babel-polyfill'

import users from '../routes/user-route'
import events from '../routes/events-route'
import images from '../routes/image-route'
import search from '../routes/search-route'
import location from '../routes/location-route'
import starwars from '../routes/starwars-route'

/* Dev */
import { greenf, redf, yellow } from '../logger'


const app = express()
const path = require('path')

const rootUrl = process.env.ROOT_URL || '../client/build'

// Serve static files from the React app
const pathToStaticFiles = path.resolve(__dirname, rootUrl)
console.log('static-root:', pathToStaticFiles)
app.use(express.static(path.resolve(__dirname, rootUrl)))

const port = process.env.PORT

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

require('../config/passport')
app.use('/api', users)
app.use('/api/events', events)
app.use('/api/images', images)
app.use('/api/search', search)
app.use('/api/location', location)
app.use('/api/starwars', starwars)
app.get('/api', (req, res) => {
  redf('Invalid endpoint!')
  res.send('Invalid endpoint!')
})

// WARN: must come after all defined routes -> look above (routes definition)
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.resolve(pathToStaticFiles, 'index.html'))
  //res.redirect('/')
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
