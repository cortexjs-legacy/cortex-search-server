#!/usr/bin/env node

var optimist = require('optimist'),
    fs = require('fs'),
    path = require('path'),
    domain = require('domain'),
    cluster = require('cluster'),
    app = require('./lib');



var opt = optimist.usage('Usage ctx-ssvr -c|--config <path> [-p|--port <port>] [-h|--help] ')
    .alias('h', 'help')
    .boolean('h')
    .describe('show help text')
    .alias('p', 'port')
    .describe('server\'s port')
    .alias('c', 'config')
    .describe('config file path')
    .default('c', './config'),
    argv = opt.argv;


if(argv.help){
    opt.showHelp();
    process.exit(2);
}    

var configPath = path.resolve(__dirname, argv.config),
    config = {};

try {
    config = require(configPath) || {};
}catch(e) {
    console.error('Fail to load config:', configPath);
    process.exit(1);
}

var d = domain.create();

d.on('error', function(err) {
    console.error('search server exits due to:', err);
    process.exit(1);
});


d.run(function() {
    app.listen(argv.port || config.port || 80);
});
