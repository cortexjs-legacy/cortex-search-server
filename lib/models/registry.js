var couche = require('couch-db');
var config = require('../configure').config;

var server = couche(config.couchdb);

server.bind('registry');

module.exports = server.registry;