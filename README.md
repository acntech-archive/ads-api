# Accenture Digital Signage Backend

## Prerequisites
* [Git](http://git-scm.com/downloads)
* [NodeJS and npm](http://nodejs.org/download/)
* [MongoDB](http://www.mongodb.org/downloads)
* [Chrome Rest Console](https://chrome.google.com/webstore/detail/rest-console/cokgbflfommojglbmbpenpphppikmonn?hl=en)

## Getting started
```
git clone https://github.com/acntech/ads-api.git
cd ads-api
npm install
start mongoDB in another terminal or background (MacOSX: mongod, Windows: ?)
Start API node server by: node server.js

```
You should be able to test REST API for the ADS API Open a web browser and go to [http://localhost:5000/api/player](http://localhost:5000/api/player)



##Mediaplayer API
Tip: use [Chrome Rest Console](https://chrome.google.com/webstore/detail/rest-console/cokgbflfommojglbmbpenpphppikmonn?hl=en) to test the REST API.
<table class="table table-hover table-striped">
      <thead>
        <tr>
          <th>HTTP Action</th>
          <th>Route</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>GET</td>
          <td>/api/player</td>
          <td>Read all MPs</td>
        </tr>
        <tr>
          <td>GET</td>
          <td>/api/player/:id</td>
          <td>Read Media Player by ID</td>
        </tr>
        <tr>
          <td>PUT</td>
          <td>/api/player/:id</td>
          <td>Update existing Media Player by ID</td>
        </tr>
        <tr>
          <td>POST</td>
          <td>/api/player</td>
          <td>Create new Media Player</td>
        </tr>
        <tr>
          <td>DELETE</td>
          <td>/api/player/:id</td>
          <td>Delete existing Media Player by ID</td>
        </tr>
      </tbody>
</table>

## Information Model

### Media Player

```javascript
    name: {
    type: String,
    trim: true
    },
    ip: String,
    location: {
       floor: {
           type: Number,
           min: 2,
           max: 4
       },
       zone: {
           type: String,
           default: 'external'
       }
    },
    isActive: {
       type: Boolean,
       default: false
    },
    created: {
       type: Date,
       default: Date.now
    },
    updated: {
       type: Date,
       default: Date.now
    }
          
```

### Example

```JSON
[
      {
       "name": "Ruby",
       "ip": "127.0.0.100",
       "_id": "5240cef5b17cf20200000001",
       "__v": 0,
       "updated": "2013-09-23T23:29:57.541Z",
       "created": "2013-09-23T23:29:57.540Z",
       "isActive": true,
       "location": {
           "floor": 2,
           "zone": "external"
       }
      },
      {
       "name": "Scala",
       "ip": "127.0.0.101",
       "_id": "5240cef5b17cf20200000002",
       "__v": 0,
       "updated": "2013-09-23T23:29:57.546Z",
       "created": "2013-09-23T23:29:57.546Z",
       "isActive": true,
       "location": {
           "floor": 2,
           "zone": "external"
       }
      }
]
```

## File API

Only jpeg files are supported now.

Tip: use [Chrome Rest Console](https://chrome.google.com/webstore/detail/rest-console/cokgbflfommojglbmbpenpphppikmonn?hl=en) to test the REST API.
<table class="table table-hover table-striped">
      <thead>
        <tr>
          <th>HTTP Action</th>
          <th>Route</th>
          <th>Description</th>
          <th>Returns</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>GET</td>
          <td>/api/sources/file</td>
          <td>Reads information about all files</td>
          <td>JSON array of all files stored. The GridStore ID, contentType, originalFileName, created, and length fields are returned. 
        </tr>
        <tr>
          <td>GET</td>
          <td>/api/sources/file/:id</td>
          <td>Get jpeg image by ID</td>
          <td>Returns the jpeg binary data to the caller</th>
        </tr>
        <tr>
          <td>POST</td>
          <td>/api/sources/file</td>
          <td>Add new jpeg file to the GridFS store</td>
          <td>Returns status code 201 to the caller</td>
        </tr>
        <tr>
          <td>DELETE</td>
          <td>/api/sources/file/:id</td>
          <td>Delete an existing files by ID</td>
          <td>Return status code 200 to the caller</td>
        </tr>
      </tbody>
</table>

### Examples

```
GET /api/sources/file
```
```JSON
[
  {
    "id": "5291fcfa71fb223332000009",
    "contentType": "image/jpeg",
    "originalFileName": "jon.jpg",
    "created": "2013-11-24T13:19:54.961Z",
    "length": 55748
  },
  {
    "id": "5291fdb1e4cf98cf32000009",
    "contentType": "image/jpeg",
    "originalFileName": "jon.jpg",
    "created": "2013-11-24T13:22:57.784Z",
    "length": 55748
  }
]
```
GET /api/sources/file/:id
```
```
image/jpeg
```

```
POST /api/sources/file
```
```
201 CREATED
```

```
DELETE /api/sources/file/:id
```
```
200 OK
```





