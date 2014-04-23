var http = require('http'),
    https = require('https'),
    koa = require('koa'),
    common = require('koa-common'),
    parse = require('co-body');


module.exports = function(config) {
    require('./configure').load(config);

    var app = koa();

    // middleware
    app.use(common.logger());
    app.use(common.responseTime());

    app.use(common.mount('/rest', require('./rest')));

    app.use(common.static(require('path').join(__dirname, '../public'), {
        defer: true
    }));

    return app;
};