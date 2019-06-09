'use strict'

var Agent = require('./src/agent')


module.exports = function(key) {
    return new Agent().start(key);
}