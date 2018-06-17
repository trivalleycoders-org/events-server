import express from 'express'
const router = express.Router()
import { append, pick } from 'ramda'
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
    // yellow('form', form)
    form.multiples = true
    form.uploadDir = path.join(__dirname, '/uploads')

    form.on('file', function(field, file) {
      red('** form.on.file')
      const newFileName = path.join(form.uploadDir, file.name)
      fs.rename(file.path, newFileName, function () {
        fs.readFile(newFileName, (err, data) => {
          if (err) throw err
          const s3 = new S3()
          const params = {Bucket: bucketName, Key: file.name, Body: data}
          s3.upload(params, function(err, data) {
            console.log('done', err, data)
            const ret = pick(['Location', 'Key'], data)
            res.send(ret)
          })
        })

      })
    })
    form.on('error', function(err) {
      red('** form.on.error')
      console.log('An error has occured: \n' + err)
    })
    form.on('end', function() {
      red('** form.on.end')
      // res.status(200).send({"message": "done"})
    })
    form.parse(req)
  } catch(e) {
    // red('events.route: post', e)
    red('error', e)
    res.status(400).send(e)
  }
})

router.get('/test', (req, res) => {
  try {
    const b = req.body
    yellow('b', b)
    res.send({"message": 'hello from GET /images/test'})
  } catch (e) {
    red('get ERROR', e)
  }
})

export default router
