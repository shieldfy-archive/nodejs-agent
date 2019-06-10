var Agent = require('../src/Agent');
var agent = new Agent();

describe("Agent",function () {
    
    it("should be successfuly intialized",function () {
        
        expect(agent.rules).toEqual(null);
        expect(agent._config).toEqual(null);
        expect(agent.sessionManager).toEqual(null);
        expect(agent.connector).toEqual(null);
        expect(agent.http).toEqual(null);
        expect(agent.Instrumenter).toEqual(null);
        expect(agent._loadedModules).toEqual({});
    });
    
    it("module should be successfuly started",function () {
        var key = "testKey";
        agent.start(key);
        
        expect(typeof(agent.rules)).toEqual('object');
        expect(typeof(agent._config)).toEqual('object');
        expect(agent._config.appKey).toEqual('testKey');
        expect(agent._config.interval).toEqual(10000);
        expect(agent._config.debug).toEqual(false);
        expect(typeof(agent.http)).toEqual('object');
        expect(agent.http.api.appKey).toEqual('testKey');
        expect(typeof(agent.Instrumenter)).toEqual('object');
        expect(typeof(agent._loadedModules)).toEqual('object');
        expect(typeof(agent.log)).toEqual('function');
        expect(typeof(agent._info)).toEqual('object');
    });

});