var assert = require('chai').assert;

require('../lib/configure').load(require('../config'));

var models = require('../lib/models');

describe('depended.js', function() {
    var depended = require('../lib/models/depended');

    it('depended', function(done) {
        depended('backbone', 0, 1000, function(err, rows) {
            assert(rows);
            done(err);
        });
    });
});

describe('package.js', function() {
    var pkg = models.package;

    it('package', function(done) {
        pkg('async', function(err, data) {
            assert(data.version);
            assert(data.dependents);
            done(err);
        });
    });
});


describe('registry.js', function() {
    var registry = require('../lib/models/registry');
    it('registry', function(done) {
        registry.info(function(err, info) {
            assert(info);
            done(err);
        });
    });
});