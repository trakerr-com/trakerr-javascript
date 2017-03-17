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
npm install --save trakerr-io/trakerr-javascript
```

To install off a branch which may have experimental features, you can use:

```
npm install --save trakerr-io/trakerr-javascript#<branch name>
```
without the angle brackets.

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
// Option-1: Add a global exception handler,
//any error thrown with throw new Error('...'); will now be sent to Trakerr
client.handleExceptions(false);
```

### Option-2: Send error to Trakerr programmatically

```javascript
    try {
        ....

    } catch(err) {
        // send it to Trakerr
        client.sendError(err);
    }
```

### Option-3: Send error to Trakerr programmatically and populate some custom properties on the event

```javascript
    try {
        ....
    } catch(err) {
        // send it to Trakerr
        client.sendError(err, "Error", function(event) {

            // set some custom properties on the event
            event.customProperties = {
                customString: {
                    customData1: "Some data"
                }
            };
        });
    }
```

### Option-4: Create and send event (including non-errors) programmatically
```javascript
try {
    // create a new event
    var appEvent = client.createAppEvent();
    
    // ... populate any member data ...

    // send it to Trakerr
    client.sendEvent(appEvent, function(error, data, response) {
        if(error) {
            console.error('Error Response: ' + error + ', data = ' + data + ', response = ' +
            JSON.stringify(response));
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

// Option-1: Add a global exception handler,
//any error thrown with throw new Error('...'); will now be sent to Trakerr
client.handleExceptions(false);

// Option-2: Send event manually to Trakerr
try {
    // create a new event
    var appEvent = client.createAppEvent();
    
    // ... populate any member data ...

    // send it to Trakerr
    client.sendEvent(appEvent, function(error, data, response) {
        if(error) {
            console.error('Error Response: ' + error + ', data = ' + data + ', response = ' +
            JSON.stringify(response));
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
    //Replace value within quotes with your API key instead
    var client = new TrakerrClient('<your api key here>');
    
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
```

## The TrakerrClient Constructor

The `TrakerrClient` class above can be constructed to take aditional data, rather than using the configured defaults. The constructor signature is:

```javascript
var exports = function TrakerrClient(apiKey,
                                     url,
                                     contextAppVersion,
                                     contextEnvName,
                                     contextEnvVersion,
                                     contextEnvHostname,
                                     contextAppOS,
                                     contextAppOSVersion,
                                     contextAppBrowser,
                                     contextAppBrowserVersion,
                                     contextDataCenter,
                                     contextDataCenterRegion)
```

Nearly all of these have default values when passed in `null`. Below is a list of the arguments, and what Trakerr expects so you can pass in custom data.

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**apiKey** | **str** | API Key for the application | 
**url** | **str** | (optional) URL to Trakerr. | [optional if passed `null`] Specify null to use default from apiClient.basePath.
**contextAppVersion** | **str** | (optional) Application version. | [optional if passed `null`] Default value: "1.0".
**contextEnvName** | **str** | (optional) Environment name like "development", "staging", "production" or a custom string. | [optional if passed `null`] Default Value: "develoment".
**contextEnvVersion** | **str** | (optional) Environment version. | [optional if passed `null`]
**contextEnvHostname** | **str** | (optional) Environment hostname. | [optional if passed `null`] Default value: `os.hostname()` if the `os` library is defined.
**contextAppOS** | **str** | (optional) Operating system. | [optional if passed `null`] Default value: `navigator.platform` if the navigator is defined by the browser, `os.platform()` if the application is not running on the browser.
**contextAppOSVersion** | **str** | (optional) Operating system version. | [optional if passed `null`] Default value: `navigator.oscpu` if navigator is defined, `os.release()` otherwise.
**contextAppBrowser** | **str** | (optional) Browser name | [optional if passed `null`] Default value: `navigator.appCodeName` if navigator is defined.
**contextAppBrowserVersion** | **str** | (optional) Browser version | [optional if passed `null`] Default value: `navigator.appVersion` if navigator is defined.
**contextDataCenter** | **str** | (optional) Data center | [optional if passed `null`] 
**contextDataCenterRegion** | **str** | (optional) Data center region | [optional if passed `null`]


<a name="documentation-for-models"></a>
## Documentation for AppEvent

 - [TrakerrApi.AppEvent](https://github.com/trakerr-io/trakerr-javascript/blob/master/generated/docs/AppEvent.md)


