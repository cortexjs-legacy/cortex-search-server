var request = require('supertest'),
    assert = require('chai').assert,
    app = require('../lib')(require('../config'));

describe('rest.js', function() {
    describe('package', function() {

        it.only('package missing', function(done) {
            request(app.listen())
                .get('/rest/package/nopackage')
                .expect(404, function(err, res) {
                    done(err);
                });
        });

        it('version missing', function(done) {
            request(app.listen())
                .get('/rest/package/align/a3.f22.3')
                .expect(400, done);
        });

        it('with version', function(done) {
            request(app.listen())
                .get('/rest/package/align/1.0.0')
                .expect(200, function(err, res) {
                    assert.equal(res.body.version, "1.0.0");
                    done(err);
                });
        });

        it('with name', function(done) {
            request(app.listen())
                .get('/rest/package/cortex')
                .expect('Content-Type', /json/)
                .expect(200, function(err, res) {
                    assert.equal(res.body.name, "cortex");
                    assert(res.body.versions);
                    done(err);
                });
        });
    });

    it('search', function(done) {
        request(app.listen())
            .get('/rest/search?q=app+cortex&limit=30')
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