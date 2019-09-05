const Shimmer = require('shimmer');
const fs = require('fs');
var Judge = require('./Judge');

function monkeyPatch(Agent)
{
    this._agent = Agent;
    this.judge = Judge(Agent);
    this.start()
}

monkeyPatch.prototype.start = function()
{
    this.monkeyRules = JSON.parse(fs.readFileSync(__dirname+'/monkey_rules/rules.json').toString())
    this.monkeyRulesModules = []
    // monkeyRulesModules is a set of non redendent module name
    // get all modules names from monkey rules
    for (let index = 0; index < this.monkeyRules.length; index++) {
        const rule = this.monkeyRules[index];
        if (this.monkeyRulesModules.includes(rule['module'])) {
            continue;
        }
        this.monkeyRulesModules.push(rule['module'])
    }
    this._agent.log(this.monkeyRules);
}

monkeyPatch.prototype.applyMonkey = function(exports, name)
{      
    try {
        var _Judge = this.judge;
        for (let index = 0; index < this.monkeyRules.length; index++) {

            var moduleName = this.monkeyRules[index]['module']
            if (moduleName != name) {
                continue;
            }

            var functionName = this.monkeyRules[index]['function']
            var paramIndcies = this.monkeyRules[index]['param-no']
            var id = this.monkeyRules[index]['id']
            var path = this.monkeyRules[index]['path']
            var dataType = this.monkeyRules[index]['rule']['dataType']
            var match = this.monkeyRules[index]['rule']['match']
            var advisoryGuid = this.monkeyRules[index]['advisoryGuid']
            var vulnerabilityGuid = this.monkeyRules[index]['vulnerabilityGuid']
            var returnedType = this.monkeyRules[index]['returnedType']

            var wrapedModule = path.length ? getWrapedModule(exports, path) : exports
            var self = this

            Shimmer.wrap(wrapedModule, functionName, function (original) {
                return function () {
                    
                    if (paramIndcies.length !== 0) {

                        for (let paramIndex = 0; paramIndex < paramIndcies.length; paramIndex++) {
                            const element = paramIndcies[paramIndex]-1;                            
                            // apply rule on specific arguments
                            let paramValue = arguments[element]
                            let result = _Judge.executeMonkey(paramValue, dataType, match)
                            if (result.isAttack) {
                                _Judge.report(id, result, element, advisoryGuid, vulnerabilityGuid)
                                if (self._agent._config.action != 'listen') {
                                    return self.mockReturned(returnedType, arguments)
                                }
                            }
                        }
                    } else {
                        // apply rule on all arguments 
                        for (const arg in arguments) {
                            let paramValue = arguments[arg]
                            let result = _Judge.executeMonkey(paramValue, dataType, match)
                            if (result.isAttack) {
                                _Judge.report(id, result, parseInt(arg), advisoryGuid, vulnerabilityGuid)
                                if (self._agent._config.action != 'listen') {
                                    return self.mockReturned(returnedType, arguments)
                                }
                            }
                        }
                    }
                    
                    var connection = original.apply(this, arguments);
                    return connection;
                }
            });
        }
    } catch (error) {
        // report to exceptions endpoint
    }  
}

monkeyPatch.prototype.mockReturned = function(returnedType, args)
{
    switch (returnedType) {
        case 'function':
            return args[getFunctionIndex(args)](new Error('shieldfy catched attack'))

        case 'promise':
            return new Promise(function(resolve, reject) {
                reject('shieldfy catched attack')
            })

        case 'null':
            return null
            
        case 'undefiend':
            return

        case 'array':
            return [];

        case 'object':
            return {};

        case 'false':
            return false;

        case '0':
            return 0;

        case '':
            return "";
    
        default:
            break;
    }
}

function getFunctionIndex (args) {
    for (const key in args) {
        if (typeof args[key] == 'function') {
            return key;
        }
    }
}

function getWrapedModule(exportsModule ,path) {
    var tempObj = exportsModule
    for (let index = 0; index < path.length; index++) {
        tempObj = tempObj[path[index]];
    }
    return tempObj
}

module.exports = monkeyPatch