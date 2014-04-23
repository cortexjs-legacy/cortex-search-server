var _ = require('underscore'),
    moment = require('moment'),
    sanitizer = require('sanitizer'),
    gravatar = require('gravatar').url,
    marked = require('marked');


var depended = require('./depended');

module.exports = function(name, version, cb) {
    var registry = require('./registry');
    if (arguments.length == 2 && typeof version == 'function') {
        cb = version;
        version = undefined;
    }

    // lastest
    version = version || '';

    if (!cb)
        return gr;
    else gr(cb);

    function gr(done) {
        registry.doc(name).open(function(err, data) {
            if (err) return done(err);

            if (data.time && data['dist-tags']) {
                var v = version || data['dist-tags'].latest;
                var t = data.time[v]
                if (!data.versions[v]) {
                    console.error('invalid package data: %s', data._id)
                    return done(new Error('invalid package: ' + data._id))
                }
                data.version = v
                if (data.versions[v].readme) {
                    data.readme = data.versions[v].readme
                    data.readmeSrc = null
                }
                data.fromNow = moment(t).fromNow()

                setLicense(data, v)
            }

            if (data.homepage && typeof data.homepage !== 'string') {
                if (Array.isArray(data.homepage))
                    data.homepage = data.homepage[0]
                if (typeof data.homepage !== 'string')
                    delete data.homepage
            }

            if (data.readme && !data.readmeSrc) {
                data.readmeSrc = data.readme
                data.readme = parseReadme(data)
            }

            gravatarPeople(data);

            depended(name, 0, 1000, function(err, rows) {
                if (err) return done(err);
                data.dependents = rows;

                var c = version ? data.versions[version] : (data['dist-tags'] && data['dist-tags'].latest &&
                    data.versions && data.versions[data['dist-tags'].latest]);
                // find right version
                if (c) {
                    _.extend(data, c);
                } else if (!version) {
                    // no latest version.  this is not valid.  treat as a 404                                                                                               
                    return done({
                        message: 'Invalid package:' + name,
                        statusCode: 404
                    });
                }

                done(err, data);
            });
        });
    };
};


function parseReadme(data) {
    var p;
    if (typeof data.readmeFilename !== 'string' ||
        (data.readmeFilename.match(/\.(m?a?r?k?d?o?w?n?)$/i) && !data.readmeFilename.match(/\.$/))) {
        try {
            p = marked.parse(data.readme);
        } catch (er) {
            console.log(er);
            return 'error parsing readme';
        }
        p = p.replace(/<([a-zA-Z]+)([^>]*)\/>/g, '<$1$2></$1>');
    } else {
        var p = data.readme
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        p = sanitizer.sanitize(p, urlPolicy);
    }
    return sanitizer.sanitize(p, urlPolicy);
}



function setLicense(data, v) {
    var latestInfo = data.versions[v],
        license;

    if (latestInfo.license)
        license = latestInfo.license;
    else if (latestInfo.licenses)
        license = latestInfo.licenses;
    else if (latestInfo.licence)
        license = latestInfo.licence;
    else if (latestInfo.licences)
        license = latestInfo.licences;
    else
        return;

    data.license = {};

    if (Array.isArray(license)) license = license[0];

    if (typeof license === 'object') {
        if (license.type) data.license.name = license.type;
        if (license.name) data.license.name = license.name;
        if (license.url) data.license.url = license.url;
    }

    if (typeof license === 'string') {
        if (license.match(/(http|https)(:\/\/)/ig)) {
            data.license.url = data.license.type = license;
        } else {
            data.license.url = getOssLicenseUrlFromName(license);
            data.license.name = license;
        }
    }
}

function getOssLicenseUrlFromName(name) {
    var base = 'http://opensource.org/licenses/';

    var licenseMap = {
        'bsd': 'BSD-2-Clause',
        'mit': 'MIT',
        'x11': 'MIT',
        'mit/x11': 'MIT',
        'apache 2.0': 'Apache-2.0',
        'apache2': 'Apache-2.0',
        'apache 2': 'Apache-2.0',
        'apache-2': 'Apache-2.0',
        'apache': 'Apache-2.0',
        'gpl': 'GPL-3.0',
        'gplv3': 'GPL-3.0',
        'gplv2': 'GPL-2.0',
        'gpl3': 'GPL-3.0',
        'gpl2': 'GPL-2.0',
        'lgpl': 'LGPL-2.1',
        'lgplv2.1': 'LGPL-2.1',
        'lgplv2': 'LGPL-2.1'
    };

    return licenseMap[name.toLowerCase()] ? base + licenseMap[name.toLowerCase()] : base + name;
}

function urlPolicy(u) {
    u = url.parse(u);
    if (!u) return null;
    if (u.protocol === 'http:' &&
        (u.hostname && u.hostname.match(/gravatar.com$/))) {
        // use encrypted gravatars                                                                                                                                
        return url.format('https://secure.gravatar.com' + u.pathname);
    }
    return url.format(u);
}


function gravatarPeople(data) {
    gravatarPerson(data.author);
    if (data.maintainers) data.maintainers.forEach(function(m) {
        gravatarPerson(m);
    })
    if (Array.isArray(data.contributors)) {
        data.contributors.forEach(function(m) {
            gravatarPerson(m);
        });
    }
}


function gravatarPerson(p) {
    if (!p || typeof p !== 'object') {
        return;
    }
    p.avatar = gravatar(p.email || '', {
        s: 50,
        d: 'retro'
    }, true);
    p.avatarMedium = gravatar(p.email || '', {
        s: 100,
        d: 'retro'
    }, true);
    p.avatarLarge = gravatar(p.email || '', {
        s: 496,
        d: 'retro'
    }, true);
}