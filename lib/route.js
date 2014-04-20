var _ = require('underscore');
var sanitizer = require('sanitizer');

module.exports = function(app) {

    var views = require('co-views'),
        models = require('./models'),
        render = views(require('path').join(__dirname, 'views'), {
            default: 'jade'
        });


    app.use(require('koa-trie-router')(app));

    app.get('/', function * () {
        this.body = yield render('index', {
            pretty: true
        });
    });

    app.get([
        '/package/:name([\\-0-9a-z]+)',
        '/package/:name([\\-0-9a-z]+)/:version'
    ], function * () {
        var name = sanitizer.sanitize(this.params.name || ''),
            version = sanitizer.sanitize(this.params.version);
        var model = yield models.package(name, version);
        this.body = yield render('package', model);
    });

    app.get('/search', function * () {
        var query = this.query,
            page = query.page || 0,
            limit = query.limit || 20,
            q = sanitizer.sanitize(query.q || '');

        var model = yield models.search(q.split(' '), page, limit);
        this.body = yield render('search', _.extend({
            pretty: true
        }, model));
    });
};