var Agent = require('../src/Agent');
var Rules = require('../src/rules');
var httpMocks = require('node-mocks-http');
var key = "testKey";
var agent = new Agent();
agent.start(key);

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

describe("Rules",function () {

    it("should be parsed successfuly",function () {
        var rules = new Rules(rulesList, agent);
                
        expect(typeof(rules._agent)).toEqual('object');
        expect(typeof(rules.rulesBank)).toEqual('object');
        expect(Object.keys(rules.rulesBank)[0]).toEqual('x-1-1-1');
        expect(rules.rulesBank['x-1-1-1']['_id']).toEqual('x-1-1-1');
        expect(rules.rulesBank['x-1-1-1']['_module']).toEqual('vulnerable-module');
        expect(rules.rulesBank['x-1-1-1']['_param']['type']).toEqual('pathname');
        expect(rules.rulesBank['x-1-1-1']['_rule']['type']).toEqual('preg');
    });

});

describe("Rules check function of vulnerable pathname attack in request",function () {

    it("should be catch attack successfuly",function () {
        var rules = new Rules(rulesList, agent);
        rules._agent._loadedModules["vulnerable-module"] = "<1.1.1"

        var request  = httpMocks.createRequest({
            method: 'GET',
            url: 'http://www.test.com/../../../..'
        });


        var requestPayload = rules.check(request)

        // check for object returned
        // expect sdk to fix request
        expect(requestPayload['url']).toEqual('/');
        expect(requestPayload['method']).toEqual('GET');

        // check for attack
        expect(request.shieldfy.isAttack).toEqual(true);
        expect(request.shieldfy.rule).toEqual('x-1-1-1');
        expect(request.shieldfy.param.type).toEqual('pathname');
        expect(request.shieldfy.param.name).toEqual('pathname');
    });

    it("shouldn't be catch any attack from not suspecies request",function () {
        var rules = new Rules(rulesList, agent);
        rules._agent._loadedModules["vulnerable-module"] = "<1.1.1"

        var request  = httpMocks.createRequest({
            method: 'GET',
            url: 'http://www.test.com/testuser?id=1'
        });


        var requestPayload = rules.check(request)
        
        // // check for object returned
        expect(requestPayload['url']).toEqual('http://www.test.com/testuser?id=1');
        expect(requestPayload['method']).toEqual('GET');

        // // check for attack
        expect(request.shieldfy.isAttack).toEqual(false);
        expect(request.shieldfy.rule).toEqual('x-1-1-1');
        expect(request.shieldfy.param.type).toEqual('pathname');
        expect(request.shieldfy.param.name).toEqual('pathname');
    });

});