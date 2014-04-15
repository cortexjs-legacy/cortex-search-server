var http = require('http'),
    https = require('https'),
    koa = require('koa'),
    common = require('koa-common'),
    parse = require('co-body');

var app = koa();

// middleware
app.use(common.logger());
app.use(common.responseTime());


require('./route')(app);

app.use(common.mount('/rest', require('./rest')));


module.exports = function(config) {
    require('./configure').load(config);
    return app;
};