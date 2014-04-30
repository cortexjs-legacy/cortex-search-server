var _ = require('underscore');
var utils = require('cortex-search-utils');
var config = require('../../config');

var search = utils(config.registry, {
    request: require('./registry').__request
});

module.exports = _.extend(search.searchByWord.bind(search), search);