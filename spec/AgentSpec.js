var Agent = require('../src/Agent');
var nock = require('nock');


describe("Agent",function () {
    beforeEach(function(done) {
        nock('https://api.shieldfy.com')
        .post('/update')
        .reply(200, {}); 
        nock('https://api.shieldfy.com')
            .post('/run')
            .reply(200, {
                "id" : "x-1-1-1",
                "module" : "vulnerable-module",
                "function" : "test",
                "version" : "<1.1.1",
                "param" : {
                    "type" : "pathname",
                    "name" : "*"
                },
                "rule" : {
                    "type" : "preg",
                    "match" : "..[\\/\\\\]+"
                }
            });
        var agent;
        this.agent = new Agent();
        done();
    });
    
    it("should be successfuly intialized",function (done) {
        
        expect(this.agent.rules).toEqual(null);
        expect(this.agent._config).toEqual(null);
        expect(this.agent.sessionManager).toEqual(null);
        expect(this.agent.connector).toEqual(null);
        expect(this.agent.http).toEqual(null);
        expect(this.agent.Instrumenter).toEqual(null);
        expect(this.agent._loadedModules).toEqual({});
        done();
    });
    
    it("module should be successfuly started",function (done) {
        var key = "testKey";
        this.agent.start(key);
        
        expect(typeof(this.agent.rules)).toEqual('object');
        expect(typeof(this.agent._config)).toEqual('object');
        expect(this.agent._config.appKey).toEqual('testKey');
        expect(this.agent._config.interval).toEqual(10000);
        expect(this.agent._config.debug).toEqual(false);
        expect(typeof(this.agent.http)).toEqual('object');
        expect(this.agent.http.api.appKey).toEqual('testKey');
        expect(typeof(this.agent.Instrumenter)).toEqual('object');
        expect(typeof(this.agent._loadedModules)).toEqual('object');
        expect(typeof(this.agent.log)).toEqual('function');
        expect(typeof(this.agent._info)).toEqual('object');
        done();
    });

});