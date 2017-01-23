README
------

TUF-2000M is an ultrasonic energy meter that has a Modbus interface 

The Webpage displays a list of Metrics provided by a TUF meter via URL

When index.html is loaded, an ajax request is sent to http://tuftuf.gambitlabs.fi/feed.txt to retrieve the values of 100 registers. 

The values of each metric are processed according to their data types based on the register readings and sent back to an object containing all the metrics

This object is displayed in the form of an HTML table with some CSS properties

To refresh/update the values, a simple webpage refresh will do the trick

To avoid CORS issues with modern browsers such as Chrome, Firefox etc. Yahoo API is used to send the request in the form of a YQL. This API handles the request on our behalf and provides the response without any issues

The code was mostly written in Javascript, Jquery, HTML and CSS

