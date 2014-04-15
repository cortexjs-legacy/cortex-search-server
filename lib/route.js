module.exports = function(app) {

    var views = require('co-views'),
        render = views(require('path').join(__dirname, 'views'), {
            default: 'jade'
        });


    app.use(require('koa-trie-router')(app));

    app.get('/', function * () {
        this.body = yield render('index', {});
    });

    app.get([
        '/package/:name([\\-0-9a-z]+)',
        '/package/:name([\\-0-9a-z]+)/:version'
    ], function * () {
        this.body = yield render('package', {
            name: 'package',
            version: '1.2.3'
        });
    });

    app.get('/search', function * () {
        this.body = yield render('search', {
            results: [{
                name: 'result1',
                version: "1.3.4"
            }, {
                name: 'p2',
                version: '3.4.4'
            }]
        });
    });
};