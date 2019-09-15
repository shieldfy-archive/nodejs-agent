var MonkeyPatch = require('../src/monkeyPatch');
const fs = require('fs');
var Agent = require('../src/Agent');
var key = "testKey";
var agent = new Agent();
agent.start(key);

var monkeyRulesList = [
    {
        "id":"test-id",
        "module":"vulnerable-module",
        "path":[],
        "function":"vulnerable-function",
        "version":"<9.9.9",
        "param-no": [1],
        "returnedType": "string",
        "rule":{
            "dataType": "object",
            "type":"preg",
            "match":"regex"
        }
    }
];

describe("Monkey Patch",function () {
    beforeEach(function(done) {
        fs.writeFileSync(__dirname+'/../src/monkey_rules/rules.json', JSON.stringify(monkeyRulesList))
        done();
    });

    afterEach(function(done) {
        fs.writeFileSync(__dirname+'/../src/monkey_rules/rules.json', JSON.stringify([]))
        done();
    })

    //MonkeyPatch.start
    it("should read rules successfuly",function () {
        var monkeypatch = new MonkeyPatch(agent)
        
        expect(monkeypatch.monkeyRulesModules[0]).toEqual('vulnerable-module');
        expect(monkeypatch.monkeyRules[0].id).toEqual('test-id');
        expect(monkeypatch.monkeyRules[0].module).toEqual('vulnerable-module');
        expect(monkeypatch.monkeyRules[0].path).toEqual([]);
        expect(monkeypatch.monkeyRules[0].function).toEqual('vulnerable-function');
        expect(monkeypatch.monkeyRules[0].version).toEqual('<9.9.9');
        expect(monkeypatch.monkeyRules[0]['param-no']).toEqual([1]);
        expect(monkeypatch.monkeyRules[0].returnedType).toEqual('string');
        expect(monkeypatch.monkeyRules[0].rule.dataType).toEqual('object');
        expect(monkeypatch.monkeyRules[0].rule.type).toEqual('preg');
        expect(monkeypatch.monkeyRules[0].rule.match).toEqual('regex');
    });

    //MonkeyPatch.mockReturned
    it("should mock returned successfuly",function () {
        var monkeypatch = new MonkeyPatch(agent)
        
        expect(monkeypatch.mockReturned('function', {'0': 1, '1': (err)=>{return 'cb invoked'}})).toEqual('cb invoked');
        expect(typeof monkeypatch.mockReturned('promise').catch(e => {})).toEqual('object');
        expect(monkeypatch.mockReturned('null')).toEqual(null);
        expect(monkeypatch.mockReturned('undefiend')).toEqual(undefined);
        expect(monkeypatch.mockReturned('array')).toEqual([]);
        expect(monkeypatch.mockReturned('object')).toEqual({});
        expect(monkeypatch.mockReturned('false')).toEqual(false);
        expect(monkeypatch.mockReturned('0')).toEqual(0);
        expect(monkeypatch.mockReturned('')).toEqual('');
    });
});

describe("getFunctionIndex",function () {
    it("should return index of function successfuly",function () {        
        expect(MonkeyPatch.getFunctionIndex ({"0":()=>{}})).toEqual('0');
    });
});

describe("getWrapedModule",function () {
    it("should return wrapped modules successfuly",function () {        
        expect(MonkeyPatch.getWrapedModule ({ "A": { "B": { "C": { "D": "d" } } } }, ["A", "B", "C"])).toEqual({ 'D': 'd' });
    });
});