'use strict'

var Agent = require('./src/Agent')


module.exports = function(key) {
    return new Agent().start(key);
}