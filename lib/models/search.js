var _ = require('underscore'),
    utils = require('cortex-search-utils');

var search = utils('http://registry.cortex.dp', {
    request: require('./registry').__request
});

module.exports = _.extend(search.searchByWord.bind(search), search);