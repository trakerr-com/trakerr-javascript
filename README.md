# trakerr-javascript - the javascript library for the Trakerr API

Get your application events and errors to Trakerr via the *Trakerr API*.

- API version: 1.0.0
- SDK version: 1.0.0

## Frameworks supported
- browserify/webpack etc.
- jquery 
- nodejs

## Dependencies
The project is hosted on github at: https://github.com/trakerr-io/trakerr-javascript.

### Installation via NPM
```
npm install --save trakerr/trakerr-javascript
```

### Installation using Bower
```
bower install https://github.com/trakerr-io/trakerr-javascript
```

## Getting Started (Node/Browser)

This library works with both node apps and browser apps seamlessly. 

For node apps just installing the above dependencies and bootstrapping the code similar to the below is sufficient. For browser apps, we recommend browserify [as instructed here](#For browser).

### Create a client
```javascript
var TrakerrClient = require('trakerr-javascript');
var client = new TrakerrClient('<your api key here>'); // replace value within quotes with your API key instead
```

### Option-1: Handle exceptions with a global handler
```javascript
// Option-1: Add a global exception handler, any error thrown with throw new Error('...'); will now be sent to Trakerr
client.handleExceptions(false);
```

### Option-2: Send error to Trakerr programmatically

```javascript
    try {

    } catch(err) {
        // send it to Trakerr
        client.sendError(err);
    }
```

### Option-3: Create and send event (including non-errors) programmatically
```javascript
// Option-2: Send event manually to Trakerr
try {
    // create a new event
    var appEvent = client.createAppEvent();
    
    // ... populate any member data ...

    // send it to Trakerr
    client.sendEvent(appEvent, function(error, data, response) {
        if(error) {
            console.error('Error Response: ' + error + ', data = ' + data + ', response = ' + JSON.stringify(response));
        } else {
            console.log('Response: data = ' + data + ', response = ' + JSON.stringify(response));
        }
    });
} catch(err) {
    console.err("Error: " + err);
}
```

### Full sample
```javascript
'use strict';

// create a new client
var TrakerrClient = require('trakerr-javascript');
var client = new TrakerrClient('<your api key here>'); // replace value within quotes with your API key instead

// Option-1: Add a global exception handler, any error thrown with throw new Error('...'); will now be sent to Trakerr
client.handleExceptions(false);

// Option-2: Send event manually to Trakerr
try {
    // create a new event
    var appEvent = client.createAppEvent();
    
    // ... populate any member data ...

    // send it to Trakerr
    client.sendEvent(appEvent, function(error, data, response) {
        if(error) {
            console.error('Error Response: ' + error + ', data = ' + data + ', response = ' + JSON.stringify(response));
        } else {
            console.log('Response: data = ' + data + ', response = ' + JSON.stringify(response));
        }
    });
} catch(err) {
    console.err("Error: " + err);
}
```

### For browser

The library also works in the browser environment via npm and [browserify](http://browserify.org/). After following
the above steps with Node.js and installing browserify with `npm install -g browserify`,
perform the following (assuming *main.js* is your entry file):

```shell
browserify main.js > bundle.js
```

Then include *bundle.js* in the HTML pages.

### For angular

Install an $exceptionHandler as shown below.

```javascript
var TrakerrClient = require('trakerr-javascript');

mod.factory('$exceptionHandler', function ($log, config) {
    var client = new TrakerrClient('<your api key here>'); // replace value within quotes with your API key instead
    
    // create a new event
    var appEvent = client.createAppEvent();
    
    appEvent.contextEnvName = config.envName;
    
    return function (exception, cause) {

        $log.error(exception);

        client.sendEvent(appEvent, function(error, data, response) {
            // ... handle or log response if needed ...
        });
    };
});
````

<a name="documentation-for-models"></a>
## Documentation for AppEvent

 - [TrakerrApi.AppEvent](https://github.com/trakerr-io/trakerr-javascript/blob/master/generated/docs/AppEvent.md)


