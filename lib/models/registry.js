var couche = require('couch-db');
var config = require('../configure').config;
var url = require('url');
var modified = require('modified');
var node_path = require('path');

var crypto = require('crypto');

var server = couche(config.couchdb);

server.bind('registry');

module.exports = server.registry;
module.exports.__server = server;
