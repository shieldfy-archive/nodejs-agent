var Instrument = require('../src/Instrument');
var Logger = require('../src/Logger');
var MonkeyPatch = require('../src/monkeyPatch');
Instrumenter = new Instrument({
    log:new Logger(false),
    _loadedModules:{},
    monkeyPatch:new MonkeyPatch({log:new Logger(false)})
});
var testModule1 = require('fs')
var testModule2 = require('url')
var testModule3 = require('node-mocks-http')

describe("Instrument",function () {

    it("should load the modules successfuly",function () {       
        expect('fs' in Instrumenter._agent._loadedModules).toEqual(true);
        expect('url' in Instrumenter._agent._loadedModules).toEqual(true);
        expect('node-mocks-http' in Instrumenter._agent._loadedModules).toEqual(true);
    });
});