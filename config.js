module.exports = {
    couchdb: 'http:/couchdb.cortex.dp/',
    registry: 'http://registry.cortex.dp/',
    port: 15000,
    "elasticsearch": {
        "url": "http://127.0.0.1:9200/cortex",
        "pageSize": 20
    },
    "debug": true
};


if(require.main == module) {
    var util = require('util');
    console.log(util.inspect(module.exports));
}
