var request = require('supertest'),
    assert = require('chai').assert,
    app = require('../lib')(require('../config'));

describe('rest.js', function() {
    it('package', function(done) {
        request(app.listen())
            .get('/rest/package/cortex')
            .expect('Content-Type', /json/)
            .expect(200, function(err, res) {
                assert.equal(res.body.name, "cortex");
                assert(res.body.versions);
                done(err);
            });
    });

    it('search', function(done) {
        request(app.listen())
            .get('/rest/search?q=app+cortex&page=0')
            .expect('Content-Type', /json/)
            .expect(200, function(err, res) {
                done(err);
            });
    });


    it('index', function(done) {
        request(app.listen())
            .get('/rest')
            .expect(404, function(err) {
                done(err);
            });
    });

});