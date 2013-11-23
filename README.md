# Accenture Digital Signage Backend

## Prerequisites
* [Git](http://git-scm.com/downloads)
* [NodeJS and npm](http://nodejs.org/download/)
* [MongoDB](http://www.mongodb.org/downloads)
* [Heroku Toolbelt](https://toolbelt.heroku.com/)
* [A Heroku user account](https://devcenter.heroku.com/articles/quickstart) (see step 1,2 and 3)
* [Chrome Rest Console](https://chrome.google.com/webstore/detail/rest-console/cokgbflfommojglbmbpenpphppikmonn?hl=en)

## Getting started
```
git clone https://github.com/ismarslomic/ads-cms-backend.git
cd ads-cms-backend
heroku login // only first time
git clone git@heroku.com:ads-cms-backend.git distHeroku
npm install
grunt build:heroku
cd distHeroku
node server
```
You should be able to test REST API for the ADS CMS Backend. Open a web browser and go to [http://localhost:5000/api/player](http://localhost:5000/api/player)

## Grunt tasks

All of these tasks should be ran from the root folder of the project.

* ``` grunt build:heroku ``` - builds and optimization of the code in app folder. Destination folder is distHeroku
* ``` grunt deploy:heroku ``` - build and deploy of distHeroku folder to Heroku application [ads-cms-frontend](http://ads-cms-frontend.herokuapp.com/)
* ``` grunt run:heroku ``` - scales the Heroku application to 1 dyno and runs it in the web browser
* ``` grunt stop:heroku ``` - scales the Heroku application down to 0 dyno and stops the application

## API
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

## Frontend
* https://github.com/ismarslomic/ads-cms-frontend

## Heroku
* Heroku application: http://ads-cms-backend.herokuapp.com
* Heroku GIT: ```git@heroku.com:ads-cms-backend.git```
* TODO: information about the frontend app in Heroku
