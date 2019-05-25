'use strict'

var Agent = require('./src/agent')

//Agent.logz = function(msg){  process._rawDebug(msg); };

module.exports = function(key) {
    return new Agent().start(key);
}