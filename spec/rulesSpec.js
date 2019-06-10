var Agent = require('../src/Agent');
var Rules = require('../src/rules');
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