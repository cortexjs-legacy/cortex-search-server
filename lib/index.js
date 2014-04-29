var http = require('http'),
    https = require('https'),
    koa = require('koa'),
    common = require('koa-common'),
    parse = require('co-body'),
    route = require('koa-route'),
    views = require('co-views');


/**
 * Module dependencies.
 */

var render = views(__dirname + '/../public/jade', {
    default: 'jade'
});

module.exports = function(config) {
    require('./configure').load(config);

    var app = koa();

    // middleware
    app.use(common.logger());
    app.use(common.responseTime());



    app.use(common.mount('/-', require('./rest')));

    app.use(common.static(require('path').join(__dirname, '../public'), {
        defer: true
    }));

    app.use(route.get('/', function* () {
        this.body = yield render('search');
    }));

    return app;
};