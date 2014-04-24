var couche = require('couch-db');
var config = require('../configure').config;
var url = require('url');
var modified = require('modified');
var node_path = require('path');

var crypto = require('crypto');


var request = modified({
    cacheMapper: function(options, callback) {
        var method = options.method.toLowerCase();
        var p = url.parse(options.url);
        var search = p.search;
        var path = p.pathname;
        if (path) {
            var filename = '';
            if (search || (method != 'get')) {
                var md5 = crypto.createHash('md5');
                md5.update(search + method);
                filename = md5.digest('hex');
            }

            callback(
                null,
                node_path.join(__dirname, '../../.cache', path, filename) + '.cache'
            );
        } else {
            callback(null, null);
        }
    }
});


var server = couche(config.couchdb, {
    request: request
});

server.bind('registry');

module.exports = server.registry;
module.exports.__server = server;
module.exports.__request = request;