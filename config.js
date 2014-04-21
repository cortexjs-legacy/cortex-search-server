module.exports = {
    name: 'cortex-search-server',
    couchdb: 'http://couch.cortex.dp/',
    port: 8010,
    "debug": true
};


if (require.main == module) {
    var util = require('util');
    console.log(util.inspect(module.exports));
}
