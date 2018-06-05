//
// import expect from 'expect'
// import request from 'supertest'
// import 'babel-polyfill'
// import app from '../server.js'
// import  Member from  '../models/member'
// import { ObjectID } from 'mongodb'
// import { red } from '../logger'
//
// // import { blue, green } from '../../log/'
// const testMembers = [
//   {
//     _id: new ObjectID(),
//     firstName: 'Jane',
//     lastName: 'Doe',
//     comments: ['comment 1', 'comment 2'],
//     email: 'jane@doe.com',
//     phone: {
//       phoneType: 'Mobile',
//       phoneNumber: '222-222-2222',
//     }
//   }, {
//     _id: new ObjectID(),
//     firstName: 'Jon',
//     lastName: 'Snow',
//     comments: ['comment 3', 'comment 4'],
//     email: 'jon@snow.com',
//     phone: {
//       phoneType: 'Work',
//       phoneNumber: '333-333-3333',
//     }
//   }
// ]
//
// beforeEach((done) => {
//
//   Member.remove({})
//   .then(() => {
//     const x = Member.insertMany(testMembers)
//     return x
//
//   })
//   .then(() => done())
//   .catch((error) => {
//     red(error)
//   })
// })
//
// after(() => {
//   process.exit(0)
// })
//
// describe('DELETE /members/:id', () => {
//   it('should remove a member', (done) => {
//     const id = testMembers[1]._id
//     const hexId = id.toHexString()
//
//     request(app).delete(`/members/${hexId}`).expect(200).expect((res) => {
//       expect(res.body.member._id).toBe(hexId)
//     }).end((err, res) => {
//       if (err) {
//         return done(err)
//       }
//       Member.findById(hexId).then((member) => {
//         expect(member).toBeFalsy()
//         done()
//       }).catch((e) => done(e))
//     })
//   })
//
//   it('should return 404 if member not found', (done) => {
//     const hexId = new ObjectID().toHexString()
//
//     request(app)
//     .delete(`/members/${hexId}`)
//     .expect(404)
//     .end(done)
//   })
//
//   it('should return 404 if object id is not invalid', (done) => {
//     // const hexId = new ObjectID().toHexString()
//     const hexId = 'junk'
//     request(app)
//     .delete(`/members/${hexId}`)
//     .expect(404)
//     .end(done)
//   })
// })
//
// describe('GET /members', () => {
//
//   // should get all members
//   it('should get all members', (done) => {
//
//     request(app).get('/members').expect(200).expect((res) => {
//       expect(res.body.members.length).toBe(2)
//     }).end(done)
//   })
// })
//
// describe('GET /members/:id', () => {
//   it('should return member doc', (done) => {
//     request(app).get(`/members/${testMembers[0]._id.toHexString()}`).expect((res) => {
//       expect(res.body.firstName).toBe(testMembers[0].firstName)
//     }).end(done)
//   })
//
//   it('should return 404 if member not found', (done) => {
//     var hexId = new ObjectID().toHexString()
//
//     request(app).get(`/members/${hexId}`).expect(404).end(done)
//   })
//
//   it('should return 404 for non-object ids', (done) => {
//     request(app).get('/members/123abc').expect(404).end(done)
//   })
// })
//
// describe('POST /members', () => {
//   it('should create a new member', (done) => {
//
//     // const firstName = 'Jim'
//     request(app).post('/members')
//     .send(testMembers[0])
//     .expect(200)
//     // .expect((res) => {
//     //   expect(res.body.firstName).toBe(testMembers[0].firstName)
//     // })
//     // .end((err, res) => {
//     //   if (err) {
//     //     return done(err)
//     //   }
//     //   Member.find(testMembers[0].firstName).then((members) => {
//     //     // expect(members.length).toBe(1)
//     //     // expect(members[0].firstName).toBe(testMembers[0].firstName)
//     //     done()
//     //   }).catch((e) => {
//     //     console.log(e)
//     //     done()
//     //   })
//     // })
//   })
// })
