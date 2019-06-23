'use strict'

var Agent = require('./src/Agent')


module.exports = function(opts) {
    return new Agent().start(opts);
}