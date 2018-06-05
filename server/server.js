import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import {green, greenf, yellow} from '../logger'
import {connectToMongo, disconnectFromMongo} from '../db'
import members from '../routes/members.route'
import roles from '../routes/roles.route'
import config from '../config'

// green('node env=', process.env.NODE_ENV)
const app = express()
const port = process.env.PORT


if (process.env.NODE_ENV !== 'test') {
  yellow('env', process.env.NODE_ENV)
  connectToMongo()
}

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use('/members', members)
app.use('/roles', roles)
app.get('/', (req, res) => {
  res.send('Invalid endpoint!')
})

app.listen(port, () => {
  greenf('server started - ', port)
})

export default app
