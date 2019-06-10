var Agent = require('../src/Agent');

describe("Agent",function () {

    it("should be successfuly intialized",function () {
        agent = new Agent();
        
        expect(agent.rules).toEqual(null);
        expect(agent._config).toEqual(null);
        expect(agent.sessionManager).toEqual(null);
        expect(agent.connector).toEqual(null);
        expect(agent.http).toEqual(null);
        expect(agent.Instrumenter).toEqual(null);
        expect(agent._loadedModules).toEqual({});
    });

});