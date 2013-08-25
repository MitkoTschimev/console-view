console-view
============

jQuery plugin for a console view which can be setup with different connection types ( ajax, event, websocket ) and highlightings

No special markup is needed, just a div for the console.

##API

###consoleView( options )
Initialize the console to the element with the connection type which was set.

````javascript
$('#myConsoleView').consoleView({
	type: "event",
	...
});
````

##Options

###type
Expected connection type of the response. One of: 'event' or 'ajax'. The type option provides a means for specifying how the console receives the data. The following values are supported:

* 'event': The data is received by the event "message"
````javascript
$mydiv.trigger("message", "some Data");
````
* 'ajax': The data is received by ajax requests which can be setup by the typeOptions

###typeOptions
* type is 'ajax': all standard [$.ajax](http://api.jquery.com/jQuery.ajax) options can be used.
* type is 'event': no options are available

###interval
How often the console will send a request ( interval in milliseconds )

###receivedData
Callback function invoked after receiving data from the source.
Here you can manipulate the data for your own usage.

!Important! The callback function must return an string ( the final message ).

###highlight
An array of highlight options which are resolved for each received message.
You can setup as many highlight options as you want! ( Becareful! don't add to much otherwise it will cost performance )

A highlight option consists of a matcher and a cssClass.
The cssClass is put around the matched string -> define the styles in css separately.
The matcher matches the text in the message -> Can be a string or a regular expression object
````avascript
$('#myConsoleView').consoleView({
    highlight: [
        {
            cssClass: 'topsecret',
            matcher: 'TOP SECRET'
        },
        {
            cssClass: 'regexpexample',
            matcher: /.findRegExp/ig
        }
    ]
})