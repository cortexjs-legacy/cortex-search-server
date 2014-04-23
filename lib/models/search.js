var _ = require('underscore'),
    utils = require('cortex-search-utils');

var search = utils(require('./registry').__server);

module.exports = _.extend(search.searchByWord.bind(search), search);