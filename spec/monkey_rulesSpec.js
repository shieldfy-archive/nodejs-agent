var MonkeyRules = require('../src/monkey_rules/index');
const fs = require('fs');

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

describe("Monkey Rules",function () {
    var monkeyRules
    beforeEach(function(done) {
        monkeyRules = new MonkeyRules(monkeyRulesList, {})
        done();
    });

    afterEach(function(done) {
        fs.writeFileSync(__dirname+'/../src/monkey_rules/rules.json', JSON.stringify([]))
        done();
    })

    it("should save the rules successfuly",function () {
        var monkeyRules = JSON.parse(fs.readFileSync(__dirname+'/../src/monkey_rules/rules.json').toString())

        expect(monkeyRules[0]['id']).toEqual("test-id");
        expect(monkeyRules[0]['module']).toEqual('vulnerable-module');
        expect(monkeyRules[0]['path']).toEqual([]);
        expect(monkeyRules[0]['function']).toEqual('vulnerable-function');
        expect(monkeyRules[0]['version']).toEqual('<9.9.9');
        expect(monkeyRules[0]['param-no']).toEqual([1]);
        expect(monkeyRules[0]['returnedType']).toEqual('string');
        expect(monkeyRules[0]['rule']['dataType']).toEqual('object');
        expect(monkeyRules[0]['rule']['type']).toEqual('preg');
        expect(monkeyRules[0]['rule']['match']).toEqual('regex');
    });

});