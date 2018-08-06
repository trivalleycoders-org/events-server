import express from 'express'
const router = express.Router()
import { append, pick } from 'ramda'
import formidable from 'formidable'
import { red, blue, yellow } from '../logger'
import path from 'path'
import fs from 'fs'
import S3 from 'aws-sdk/clients/s3'

const bucketName = 'photo-app-tvc'

const getDateAndTime = () => {
  var today = new Date()
  var dd = today.getDate()
  var mm = today.getMonth() + 1 // January is 0!
  var yyyy = today.getFullYear()

  if (dd < 10) {
    dd = '0' + dd
  }

  if (mm < 10) {
    mm = '0' + mm
  }

  today = mm + '-' + dd + '-' + yyyy + '-' + today.getTime()
  return today
}

router.post('/', async (req, res) => {
  try {
    ////////////////////////////////////////////
    const form = new formidable.IncomingForm()
    let newFileName = undefined

    // yellow('form', form)
    form.multiples = true
    form.uploadDir = path.join(__dirname, '../uploads')

    form.on('file', function (field, file) {
      red('** form.on.file')
      const fname = file.name
      const newName = fname.substring(0, fname.lastIndexOf('.')) + '-' + getDateAndTime() + fname.substring(fname.lastIndexOf('.'))
      newFileName = path.join(form.uploadDir, newName)
      fs.rename(file.path, newFileName, function () {
        fs.readFile(newFileName, (err, data) => {
          if (err) throw err
          const s3 = new S3()
          const params = { Bucket: bucketName, Key: newName, Body: data }
          s3.upload(params, function (err, data) {
            console.log('done', err, data)
            const ret = pick(['Location', 'Key'], data)
            res.send(ret)
          })
        })
        console.log('newFileName:  ', newFileName)
        fs.unlink(newFileName, (err) => {
          if (err) {
            red('error while deleting', err)
          }
          console.log('Successfully deleted ', newFileName)
        })
      })
    })
    form.on('error', function (err) {
      red('** form.on.error')
      console.log('An error has occured: \n' + err)
    })
    form.on('end', function () {
      red('** form.on.end')
      // res.status(200).send({"message": "done"})
    })
    form.parse(req)
  } catch (e) {
    // red('events.route: post', e)
    red('error', e)
    res.status(400).send(e)
  }
})

export default router
