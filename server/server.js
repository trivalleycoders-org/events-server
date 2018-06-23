import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import {greenf, redf, yellow} from '../logger'
import {connectToMongo, disconnectFromMongo} from '../db'
import events from '../routes/events-route'
import images from '../routes/image-route'
import tags from '../routes/tags-route'
import '../config'

// green('node env=', process.env.NODE_ENV)
const app = express()
const port = process.env.PORT


if (process.env.NODE_ENV !== 'test') {
  yellow('server.env', process.env.NODE_ENV)
  connectToMongo()
}

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use('/events', events)
app.use('/images', images)
app.use('/tags', tags)
app.get('/', (req, res) => {
  redf('Invalid endpoint!')
  res.send('Invalid endpoint!')
})

app.listen(port, () => {
  greenf('server started - ', port)
})

export default app
