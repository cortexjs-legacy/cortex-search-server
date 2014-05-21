module.exports = {
    name: 'cortex-search-server',
    couchdb: 'http://couch.cortexjs.org',
    registry: 'http://registry.cortexjs.org',
    port: 8010,
    debug: true
};


if (require.main == module) {
    var util = require('util');
    console.log(util.inspect(module.exports));
}
