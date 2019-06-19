var Instrument = require('../src/Instrument');
var Logger = require('../src/Logger');
Instrumenter = new Instrument({
    log:new Logger(false),
    _loadedModules:{}
});

describe("Instrument",function () {

    it("should load the modules successfuly",function () {        
        expect('fs' in Instrumenter._agent._loadedModules).toEqual(true);
        expect('url' in Instrumenter._agent._loadedModules).toEqual(true);
        expect('node-mocks-http' in Instrumenter._agent._loadedModules).toEqual(true);
    });
});