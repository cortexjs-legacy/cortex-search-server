var http = require('http'),
    https = require('https'),
    express = require('express');


var app = module.exports = express();


app.set('name', 'cortex-search-server');


app.get('/', function(req, res) {
    res.send('Hello this is index page');
});


var oldListen = app.listen;
app.listen = function() {
    console.log(app.get('name') + ' is listening to port ' + (arguments[0] || 80) + '...');
    oldListen.apply(this, arguments);
};
