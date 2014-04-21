var _ = require('underscore'),
    moment = require('moment'),
    sanitizer = require('sanitizer'),
    async = require('async'),
    marked = require('marked');


var depended = require('./depended');


// skip and limit on views will slow down the couch performance, but it's not important now.
// TODO: use the key as startkey to reduce the skip overhead
module.exports = function(keys, skip, limit, options, cb) {
    var registry = require('./registry');

    if (arguments.length == 2 && typeof skip == 'function') {
        cb = skip;
        skip = limit = undefined;
        options = {};
    } else if (arguments.length == 3 && typeof skip == 'object' && typeof limit == 'function') {
        cb = limit;
        options = skip;
        skip = limit = undefined;
    }

    options = options || {};

    if (typeof keys == 'string')
        keys = [keys];

    if (!cb)
        return gr;
    else gr(cb);

    function gr(done) {
        async.parallel(keys.map(function(k) {
            return function(cb) {
                registry.view('app/wordSearch').query(options).groupLevel(6)
                    .startkey([k]).endkey([k].concat({}))
                    .skip(skip || 0).limit(limit || 20)
                    .exec(function(err, data) {
                        if (err) return cb(err);
                        if (!data)
                            return cb(undefined, []);

                        return cb(undefined, data.map(transform));
                    });
            };
        }), function(err, results) {
            if (err) return done(err);
            done(err, results.reduce(function(memo, r) {
                return memo.concat(r);
            }, []));
        });
    };
};

module.exports.searchByName = function(keys, options, cb) {

};

module.exports.searchByKeyword = function(keys, options, cb) {

};

module.exports.searchByUser = function(users, options, cb) {

};


function transform(data) {
    return {
        name: data.key[1],
        description: data.key[2],
        url: '/package/' + data.key[1],
        latest: data.key[3],
        maintainer: data.key[4],
        keywords: data.key[5] ? data.key[5].split(' ') : []
    };
}