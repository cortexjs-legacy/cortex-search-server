module.exports = function(name, skip, limit, cb) {
    // dependedUpon
    var registry = require('./registry');

    return cb ? gr(cb) : gr;

    function gr(done) {
        registry.view('app/dependedUpon').query().startkey([name]).endkey([name, {}])
            .skip(skip || 0).limit(limit || 1000).groupLevel(3)
            .exec(function(err, data) {
                if (!data) {
                    console.warn('no dependents?', name, data, skip, limit)
                    data = [];
                } else
                    data = data.map(function(row) {
                        return {
                            name: row.key[1],
                            description: row.key[2],
                            url: '/package/' + row.key[1]
                        };
                    });

                done(err, data);
            });
    }
};