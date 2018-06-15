import express from 'express'
const router = express.Router()
import Event from '../models/event'
import { isValidObjectID } from '../db/utils'
import { append } from 'ramda'
import formidable from 'formidable'
import { red, blue, yellow } from '../logger'
import path from 'path'
import fs from 'fs'
import S3 from 'aws-sdk/clients/s3'

const bucketName = 'photo-app-tvc'

router.post('/', async (req, res) => {
  try {
    ////////////////////////////////////////////
    const form = new formidable.IncomingForm()
    yellow('form', form)
    form.multiples = true
    form.uploadDir = path.join(__dirname, '/uploads')

    form.on('file', function(field, file) {
      const newFileName = path.join(form.uploadDir, file.name)
      fs.rename(file.path, newFileName, function () {
        fs.readFile(newFileName, (err, data) => {
          if (err) throw err;
          const s3 = new S3()
          const params = {Bucket: bucketName, Key: file.name, Body: data}
          s3.upload(params, function(err, data) {
            console.log('done', err, data);
          });
        });

      });
    });

    // log any errors that occur
    form.on('error', function(err) {
      console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
      res.end('image added');
    });

    // parse the incoming request containing the form data
    form.parse(req);
    ////////////////////////////////////////

  } catch (e) {
    // red('events.route: post', e)
    red('error', e)
    res.status(400).send(e)
  }
})

router.get('/', async (req, res) => {
  try {
    let events = await Event.find()
    res.send({events})
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/:id', async (req, res) => {
  const id = req.params.id
  if (!isValidObjectID(id)) {
    return res.status(404).send()
  }
  try {
    let event = await Event.findById(id)
    if (!event) {
      return res.status(404).send()
    }
    res.send(event)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/', async (req, res) => {
  try {
    const event = req.body
    yellow('post: event', event)
    let ne = new Event(event)
    const eventAdded = await ne.save()
    yellow('eventAdded', eventAdded)
    res.send(eventAdded)
  } catch (e) {
    // red('events.route: post', e)
    red('error', e)
    res.status(400).send(e)
  }
})

router.delete('/:id', async (req, res) => {
  const id = req.params.id
  if (!isValidObjectID(id)) {
    return res.status(404).send()
  }
  try {
    let event = await Eventember.findByIdAndRemove(id)
    if (!event) {
      return res.status(404).send()
    }
    res.send({event})
  } catch (e) {
    res.status(400).send()
  }
})

router.patch('/:id', async (req, res) => {

  try {
    const id = req.params.id
    yellow('patch: id', id)
    if (!isValidObjectID(id)) {
      return res.status(404).send()
    }
    const eventSent = req.body.event
    yellow('patch: body', req.body)
    const eventToReturn = await Event.findByIdAndUpdate(id, { $set: eventSent }, { new: true })
    yellow('patch: returned event', eventToReturn)
    if (!eventToReturn) {
      return res.status(404).send()
    }
    res.send(eventToReturn)
  } catch (e) {
    res.status(400).send()
  }

})


export default router
