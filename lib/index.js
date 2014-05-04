var http = require('http'),
    https = require('https'),
    path = require('path'),
    koa = require('koa'),
    common = require('koa-common'),
    parse = require('co-body'),
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

    app.use(require('koa-trie-router')(app));

    // middleware
    app.use(common.logger());
    app.use(common.responseTime());


    app.use(common.mount('/-', require('./rest')));


    app.use(common.static(require('path').join(__dirname, '../public'), {
        defer: true
    }));

    var stylus = require('stylus').middleware({
        src: path.join(__dirname, '../public'),
        dest: path.join(__dirname, '../public'),
        compile: function compile(str, path) {
            return require('stylus')(str)
                .set('compress', true)
                .use(require('nib')())
                .import('nib');
        }
    });

    app.use(function * (next) {
            var req = this.req,
            res = this.res;
        yield function(done) {
            stylus(req, res, done);
        };
        yield next;
    });

    app.get([
        '/',
        '/package/:name([\\-0-9a-z]+)'
    ], function * () {
        this.body = yield render('search');
    });


    return app;
};