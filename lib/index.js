var http = require('http'),
    https = require('https'),
    koa = require('koa'),
    views = require('co-views'),
    common = require('koa-common'),
    parse = require('co-body');

var app = module.exports = koa();
app.use(require('koa-trie-router')(app));

var render = views(__dirname + './views', {
    default: 'jade'
});

// middleware
app.use(common.logger());
app.use(common.responseTime());



app.get('/', require('./route/index'));
app.get([
    '/package/:name([\\-0-9a-z]+)',
    '/package/:name([\\-0-9a-z]+)/:version'
], require('./route/package'));
app.get('/search', require('./route/search'));