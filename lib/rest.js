var koa = require('koa'),
    views = require('co-views'),
    sanitizer = require('sanitizer'),
    common = require('koa-common'),
    semver = require('semver'),
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

    if (version) {
        if (!semver.valid(version)) {
            this.
            throw ("Invalid version", 400);
            yield next;
            return;
        }
    }

    try {
        this.body = yield models.package(name, version);
    } catch (e) {
        if (e.statusCode)
            this.
        throw (e.error, e.statusCode);
        else
            throw e;
    }


    yield next;
});

app.get('/search', function * (next) {
    var query = this.query,
        limit = parseInt(query.limit) || 20,
        skip = parseInt(query.skip) || 0,
        q = sanitizer.sanitize(query.q || ''),
        keyword = sanitizer.sanitize(query.keyword || ''),
        author = sanitizer.sanitize(query.author || ''),
        name = sanitizer.sanitize(query.name || '');

    if (!(q || keyword || author || name)) {
        this.
        throw ('Please provide one search critiera')
        yield next;
        return;
    }


    if (q) {
        try {
            this.body = yield models.search.searchByWord(q.split(' '), {
                skip: skip,
                limit: limit
            });
        } catch (e) {
            if (e.statusCode)
                this.
            throw (e.error, e.statusCode);
            else
                throw e;
        }
    } else {
        var mix = (keyword && author) || (author && name) || (keyword && name);
        if (mix) {
            var q = {};
            keyword && (q.keyword = keyword);
            author && (q.author = author);
            name && (q.name = name);

            this.body = yield models.search.searchAl(q, {
                skip: skip,
                limit: limit
            });
        } else {
            if (keyword) {
                this.body = yield models.search.searchByKeyword(keyword.split(','));
            } else if (author)
                this.body = yield models.search.searchByAuthor(author.split(','));
            else if (name)
                this.body = yield models.search.searchByName(name.split(','));
        }
    }

    yield next;
});