var registry = require('./registry');

module.exports.browseUpdated = function(limit, cb) {
    if (typeof limit == 'function' && arguments.length == 1) {
        cb = limit;
        limit = undefined;
    }


    limit = limit || 20;

    if (cb)
        return gr(cb);
    else
        return gr;

    function gr(done) {
        registry.view('app/browseUpdated').query().descending(true).limit(limit).groupLevel(3)
            .exec(function(err, rows) {
                if (err) return done(err);
                done(null, rows.map(transform));
            });
    }
};


function transform(data) {
    return {
        name: data.key[1],
        description: data.key[2],
        url: '/package/' + data.key[1],
        udpated: data.key[0]
    };
}