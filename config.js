module.exports = {
    name: 'cortex-search-server',
    couchdb: 'http://couch.cortex.dp/',
    port: 8010,
    "elasticsearch": {
        "url": "http://127.0.0.1:9200/cortex",
        "pageSize": 20
    },
    "debug": true
};


if (require.main == module) {
    var util = require('util');
    console.log(util.inspect(module.exports));
}