# Trakerr-javascript API client

Get your application events and errors to Trakerr via the *Trakerr API*.

- API version: 1.0.0
- SDK version: 1.0.2

## Frameworks supported
- grunt.js (if you want to build from source)
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

For node apps just installing the above dependencies and bootstrapping the code similar to the below is sufficient. See the instructions below for the browser.

### Create a client
In your script, the first thing before sending an event is to create a client. For npm apps, you may use require, but other options are also listed below.

```javascript
var TrakerrClient = require('trakerr-javascript');
var client = new TrakerrClient('<your api key here>', '<app version here>', '<deployment stage here>'); // replace value within quotes with your values instead
```

### Option-1: Handle exceptions with a global handler
Calling handleExceptions will send any following error to Trakerr using the onerror handler. If you are calling this from the browser, you may need to handle any exceptions you encounter yourself, as we only send the event to trakerr. If you are not, read about handleException's shouldDie flag.

```javascript
// Option-1: Add a global exception handler,
//any error thrown with throw new Error('...'); will now be sent to Trakerr
client.handleExceptions(false);
```

### Option-2: Send error to Trakerr programmatically
This will allow you to catch and send a specific error to trakerr, also allowing you to handle it afterwards.

```javascript
    try {
        ....

    } catch(err) {
        // send it to Trakerr
        client.sendError(err);
    }
```

### Option-3: Send error to Trakerr programmatically and populate some custom properties on the event
Passing a function to sendError will allow you to quickly populate the properties of the created AppEvent. For AppEvent's properties, see it's docs in the generated folder. The function must take in a parameter.

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
You may also send non-errors in a similar fashion from the sendEvent method (as opposed to the sendError method). We recommend that you pass this one a function, and fill it out with custom properties useful to you.

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

We recommend with the above samples 2-4 you populate the EventUser and EventSession fields of app event with the pertinant data to help you identify issues. Option 1 sends no custom data at this time.

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
The library also works in the browser environment. Simply include the trakerr.min.js in the dist folder of our repo as a script, and you should be able to call TrackerrClient from the following scripts. The command to include TrakerrClient on your page would look like:

```html
<script src="trakerr.min.js"></script>
```
You should not need to `require` in the previous examples. Otherwise, they should all work.
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
The `TrakerrClient`'s constructor initalizes the default values to all of TrakerrClient's properties.

```javascript
var exports = function TrakerrClient(apiKey,
                                     contextAppVersion,
                                     contextDevelopementStage)
```

The TrakerrClient class however has a lot of exposed properties. The benefit to setting these immediately after after you create the TrakerrClient is that AppEvent will default it's values against the TrakerClient that created it. This way if there is a value that all your AppEvents uses, and the constructor default value currently doesn't suit you; it may be easier to change it in TrakerrClient as it will become the default value for all AppEvents created after. A lot of these are populated by default value by the constructor, but you can populate them with whatever string data you want. The following table provides an in depth look at each of those.

Name | Type | Description | Notes
------------ | ------------- | -------------  | -------------
**apiKey** | **string** | API key generated for the application | 
**contextAppVersion** | **string** | Application version information. | Default value: "1.0" 
**contextDevelopmentStage** | **string** | One of development, staging, production; or a custom string. | Default Value: "develoment"
**contextEnvLanguage** | **string** | Constant string representing the language the application is in. | Default value: "JavaScript"
**contextEnvName** | **string** | Name of the interpreter the program is run on. | Default Value: "JavaScript"
**contextEnvVersion** | **string** | "Version" of JavaScript this program is running on. While this field is useful in other languages, since each browser or server impements their own features, sometimes not along version specification lines, the default value instead provided another useful value that may come close to being a version. | Default Value: `navigator.userAgent`if navigator is defined, `undefined` otherwise
**contextEnvHostname** | **string** | Hostname or ID of environment. | Default value: `os.hostname()` in a non-browser enviroment, `undefined` otherwise.
**contextAppOS** | **string** | OS the application is running on. | Default value: OS name (ie. Windows, MacOS).
**contextAppOSVersion** | **string** | OS Version the application is running on. | Default value: OS Version.
**contextAppOSBrowser** | **string** | An optional string browser name the application is running on. | Defaults to the browser name if the app is running from a browser.
**contextAppOSBrowserVersion** | **string** | An optional string browser version the application is running on. | Defaults to the browser version if the app is running from a browser.
**contextDataCenter** | **string** | Data center the application is running on or connected to. | Defaults to `nil`
**contextDataCenterRegion** | **string** | Data center region. | Defaults to `nil`


<a name="documentation-for-models"></a>
## Documentation for AppEvent

 - [TrakerrApi.AppEvent](https://github.com/trakerr-io/trakerr-javascript/blob/master/generated/docs/AppEvent.md)
