# rotary-server

## status

[![Build Status](https://travis-ci.org/trivalleycoders-org/rotary-server.svg?branch=master)](https://travis-ci.org/trivalleycoders-org/rotary-server)

## Notes
CI is using the yarn.lock file. Therefore, use Yarn and NOT NPM.

## Use

### Start MongoDB server

### Create the users collection
use EventsDev
db.createCollection( "users", {
   validator: { $jsonSchema: {
      bsonType: "object",
      required: [ "email", "hash" ],
      properties: {
          email: {
            bsonType : "string",
            pattern : "@mongodb\.com$",
            description: "must be a string and match the regular expression pattern"
         },
         hash: {
            bsonType: "string",
            description: "must be a string and is required"
         },
         salt: {
            bsonType: "string",
            description: "salt to transform hash"
         }
      }
   } }
} )

### Run server
```
$ yarn start
```
### Run tests
#### once
```
$ yarn test
```
#### or with nodemon
```
$ yarn test-watch
```

### Setup