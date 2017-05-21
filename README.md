# Trakerr - Javascript API Client
Get your application events and errors to Trakerr via the *Trakerr API

## 3-minute Integration Guide
### Requirements
Node or Javascript supported Browser.
- [superagent.js](https://github.com/visionmedia/superagent)
- [stacktrace.js](https://www.stacktracejs.com/)

### HTML/Javascript: 3-minute guide
Include the following in your HTML

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/superagent/3.5.2/superagent.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/stacktrace.js/1.3.1/stacktrace.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/trakerr-com/trakerr-javascript@1.1.0/dist/trakerr.min.js"></script>
<script>function initTrakerr() {  var c = new TrakerrClient('<api-key>', '1.0', 'production'); c.handleExceptions(false); } initTrakerr();</script>
```

You can replace `1.0` and `production` with the values of app version and deployment stage of your codebase.

This will catch all errors using javascript's onerror and send them to trakerr. While this code is fast and clean, we recommend using the Detailed Integration Guide below to send more useful information about errors.

### NodeJS: 3-minute guide
If you use NPM, install as follows:
```bash
npm install --only=prod --save trakerr-com/trakerr-javascript
```

If you use Bower, install as follows:
```bash
bower install https://github.com/trakerr-io/trakerr-javascript
```

Install global handler
```javascript
var TrakerrClient = require('trakerr-javascript'); //This is only necessary for NPM use.
var client = new TrakerrClient('<api-key>',   //Your API key
                               '1.0',         //Your app version
                               'production'); //Custom deployment stage of your code.

//any error thrown with throw new Error('...'); will now be sent to Trakerr
client.handleExceptions(false);
```

### Angular: 3-minute guide

Include the dependencies and initialize the global client variable with your API key:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/superagent/3.5.2/superagent.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/stacktrace.js/1.3.1/stacktrace.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/trakerr-com/trakerr-javascript@1.1.0/dist/trakerr.min.js"></script>
<!-- initialize the client globally -->
<script> trakerr = new TrakerrClient('<api-key>',   //Your API key
                                     '1.0',         //Your app version
                                     'production'); //Custom deployment stage of your code.
</script>
```

And in the angular module, install an $exceptionHandler as shown below:

```javascript
angular.module('your app').factory('$exceptionHandler', ['$window', function ($window) {
    //Replace value within quotes with your API key instead

    // create a new event
    var appEvent = $window.trakerr.createAppEvent();

    return function (exception, cause) {
        // ...

        $window.trakerr.sendError(exception, "Error", function(error, data, response) {
            // ... handle or log response if needed ...

            $log.error(exception, cause);//Relogs the error on the console
        });
    };
}]);
```

## Detailed Integration Guide
This library works with both node apps and browser apps seamlessly. 

### Create a client
In your script, the first thing before sending an event is to create a client. For npm apps, you may use require, but other options are also listed below.

```javascript
var TrakerrClient = require('trakerr-javascript'); //This is only necessary for NPM use.
var client = new TrakerrClient('<api-key>',                //Your API key
                               '<app version here>',       //Your app version
                               '<deployment stage here>'); //Custom deployment stage of your code.
```

### Option-1: Handle exceptions with a global handler
Calling handleExceptions will send any following error to Trakerr using the onerror handler. If you are calling this from the browser, the shouldDie flag is not relevent to you; and this will catch all unhandled thrown errors. If you are not calling the library from the browser, read about handleException's shouldDie flag.

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
Passing a function to sendError will allow you to quickly populate the properties of the created AppEvent. For [AppEvent's properties](generated/docs/AppEvent.md), see it's docs in the generated folder. The function must take in a parameter.

```javascript
    try {
        ....
    } catch(err) {
        // send it to Trakerr
        client.sendError(err, "Error", function(event) {

            // set some custom properties on the event
            event.contextOperationTimeMillis = 1000
            event.eventUser = "jake@trakerr.io"
            event.eventSession = "20"
            event.contextDevice = "pc"
            event.contextAppSku = "mobile"
            event.contextTags = ["client", "frontend"]

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

## The TrakerrClient Constructor
The `TrakerrClient`'s constructor initalizes the default values to all of TrakerrClient's properties.

```javascript
var exports = function TrakerrClient(apiKey,
                                     contextAppVersion,
                                     contextDevelopementStage)
```

The TrakerrClient module has a lot of exposed properties. The benefit to setting these immediately after after you create the TrakerrClient is that AppEvent will default it's values against the TrakerClient that created it. This way if there is a value that all your AppEvents uses, and the constructor default value currently doesn't suit you; it may be easier to change it in TrakerrClient as it will become the default value for all AppEvents created after. A lot of these are populated by default value by the constructor, but you can populate them with whatever string data you want. The following table provides an in depth look at each of those.

If you're populating an app event directly, you'll want to take a look at the [AppEvent properties](generated/docs/AppEvent.md) as they contain properties unique to each AppEvent which do not have defaults you may set in the client.

Name | Type | Description | Notes
------------ | ------------- | -------------  | -------------
**apiKey** | **string** | API key generated for the application | 
**contextAppVersion** | **string** | Application version information. | Default value: `1.0`
**contextDevelopmentStage** | **string** | One of development, staging, production; or a custom string. | Default Value: `development`
**contextEnvLanguage** | **string** | Constant string representing the language the application is in. | Default value: `JavaScript`
**contextEnvName** | **string** | Name of the interpreter the program is run on. | Default Value: `JavaScript`
**contextEnvVersion** | **string** | "Version" of JavaScript this program is running on. While this field is useful in other languages, since each browser or server impements their own features, sometimes not along version specification lines, the default value instead provided another useful value that may come close to being a version. | Default Value: `navigator.userAgent`if navigator is defined, `undefined` otherwise
**contextEnvHostname** | **string** | Hostname or ID of environment. | Default value: `os.hostname()` in a non-browser enviroment, `undefined` otherwise.
**contextAppOS** | **string** | OS the application is running on. | Default value: OS name (ie. Windows, MacOS).
**contextAppOSVersion** | **string** | OS Version the application is running on. | Default value: OS Version.
**contextAppOSBrowser** | **string** | An optional string browser name the application is running on. | Defaults to the browser name if the app is running from a browser.
**contextAppOSBrowserVersion** | **string** | An optional string browser version the application is running on. | Defaults to the browser version if the app is running from a browser.
**contextDataCenter** | **string** | Data center the application is running on or connected to. | Defaults to `'undefined'`
**contextDataCenterRegion** | **string** | Data center region. | Defaults to `'undefined'`
**contextTags** | **Array.<String>** | Array of string tags you can use to tag your components for searching., | Defaults to `'undefined'`
**contextAppSKU** | **string** | Application SKU. | Defaults to `'undefined'`


## Documentation for AppEvent
 - [TrakerrApi.AppEvent](https://github.com/trakerr-com/trakerr-javascript/blob/master/generated/docs/AppEvent.md)

## Developer dependencies
- [grunt.js](https://gruntjs.com/) (if you want to build from source)

## Installation via NPM
To install off a branch which may have experimental features, you can use:

```bash
npm install --only=prod --save trakerr-com/trakerr-javascript#<branch name>
```
without the angle brackets.

## Building from Source
If you want to build from source for the browser, use the following command:

```bash
npm install [--save] trakerr-com/trakerr-javascript
```

or

```bash
npm install [--save] trakerr-com/trakerr-javascript#<branch name>
```

you can then use grunt to compile your own minified version of the code. The grunt task we use can be executed with:

```bash
grunt build
```
in the folder with gruntFile.js. If you wish to modify or fork our code, simply run `grunt build` after modifying the code to try it out in your browser locally.

