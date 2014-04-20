var koa = require('koa'),
    views = require('co-views'),
    sanitizer = require('sanitizer'),
    common = require('koa-common'),
    parse = require('co-body');

var models = require('./models');
var app = module.exports = koa();

// middleware
app.use(common.logger());
app.use(common.responseTime());


app.use(require('koa-trie-router')(app));


app.get([
    '/package/:name([\\-0-9a-z]+)',
    '/package/:name([\\-0-9a-z]+)/:version'
], function * (next) {
    var name = this.params.name,
        version = this.params.version || '';

    this.body = yield models.package(name, version);

    yield next;
});

app.get('/search', function * (next) {
    var query = this.query,
        page = query.page || 0,
        limit = query.limit || 20,
        q = sanitizer.sanitize(query.q || '');

    this.body = yield models.search(q.split(' '), page * limit, limit);

    yield next;
});