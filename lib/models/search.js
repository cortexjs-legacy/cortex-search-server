var _ = require('underscore');
var utils = require('cortex-search-utils');
var config = require('../../config');

var search = utils(config.registry);

module.exports = _.extend(search.searchByWord.bind(search), search);
