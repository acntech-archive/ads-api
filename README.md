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
You should be able to test REST API for the ADS API Open a web browser and go to [http://localhost:5000/api/player](http://localhost:5000/api/player). If you are going to use the Twitter API, you need to download the configuration used to log into the Twitter useraccount for searching. Contact the authors for more information, or use your own account (see intructions below).

## API
Tip: use [Chrome Rest Console](https://chrome.google.com/webstore/detail/rest-console/cokgbflfommojglbmbpenpphppikmonn?hl=en) to test the REST API.
### Players
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

### Twitter
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
          <td>/api/sources/twitter</td>
          <td>Read all tweets (search for hashtags)</td>
        </tr>
        <tr>
          <td>GET</td>
          <td>/api/sources/twitter/edit</td>
          <td>Read the current Twitter configuration</td>
        </tr>
        <tr>
          <td>POST</td>
          <td>/api/sources/twitter/edit</td>
          <td>Replace the current Twitter configuration</td>
        </tr>
      </tbody>
</table>

### Ruter
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
          <td>/api/sources/ruter</td>
          <td>Read next departures from Ruter from the configured stop</td>
        </tr>
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
## Twitter configuration
If you are going to use a custom Twitter account, add configuration based on the following template to the testdata.js file (this inserts the configuration into MongoDB):
```Javascript
    // Create Twitter Configuration
    var twCon = new TwitterConfig({
        consumerKey:'insertconsumerkeyhere',
        consumerSecret: 'insertconsumersecrethere',
        accessToken: 'insertaccesstokenhere',
        accessTokenSecret: 'insertaccesstokensecrethere',
        hashes: [
            { hash: 'ACNTech' }
        ],
        callbackUrl: 'http://this.is.a.placeholder.com',
        numOfTweets: 15
    });
    twCon.save(function (err) {
        if (err) console.log('Error on saving Twitter Configuration!');
        else console.log('Saved new Twitter Configuration');
    });
```


