var Judge = require('../src/Judge');
var httpMocks = require('node-mocks-http');
var Rules = require('../src/rules');
var Agent = require('../src/Agent');
var key = "testKey";
var agent = new Agent();
agent.start(key);

describe("Judge",function () {

    var rulesList = [
        {
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
        }
    ];
    agent.rules = new Rules(rulesList, agent);

    describe(".execute",function () {
        var judge = new Judge(agent)
        var request  = httpMocks.createRequest({
            method: 'GET',
            url: 'http://www.test.com/../../../'
        });

        it("should be execute rules on request",function () {
            var result = judge.execute(request)
            expect(result).toEqual(false);
        })

        it("should catch and report for attack",function () {
            agent.rules._agent._loadedModules["vulnerable-module"] = "<1.1.1"
            request.connection = { remoteAddress: '127.0.0.1'}
            var result = judge.execute(request)
            expect(result).toEqual(true);
        })
    });

    describe(".executeMonkey",function () {
        var judge = new Judge(agent)
        var test
        it("should match attack",function () {            
            expect(judge.executeMonkey(test, "undefined", "regex").isAttack).toEqual(true);
            expect(judge.executeMonkey(()=>{}, "function", '()=>{}').isAttack).toEqual(true);
            expect(judge.executeMonkey("string", "string", "string").isAttack).toEqual(true);
            expect(judge.executeMonkey(1, "number", "1").isAttack).toEqual(true);
            expect(judge.executeMonkey(1, "string", "1").isAttack).toEqual(false);
        })
    });
});