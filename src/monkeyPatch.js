// var Rules = require('./rules');
const Hook = require('require-in-the-middle');
const Shimmer = require('shimmer');
const fs = require('fs');

function monkeyPatch(Agent)
{
    this._agent = Agent;
    this.start()
}

monkeyPatch.prototype.start = function()
{
    this.monkeyRules = JSON.parse(fs.readFileSync(__dirname+'/monkey_rules/rules.json').toString())
    this.monkeyRulesModules = []
    for (let index = 0; index < this.monkeyRules.length; index++) {
        const rule = this.monkeyRules[index];
        if (this.monkeyRulesModules.includes(rule['module'])) {
            continue;
        }
        this.monkeyRulesModules.push(rule['module'])
    }
}

monkeyPatch.prototype.update = function()
{

}

monkeyPatch.prototype.applyMonkey = function(exports, name)
{    
    for (let index = 0; index < this.monkeyRules.length; index++) {

        var moduleName = this.monkeyRules[index]['module']
        if (moduleName != name) {
            continue;
        }

        var functionName = this.monkeyRules[index]['function']
        var paramIndex = this.monkeyRules[index]['param-no']
        var dataType = this.monkeyRules[index]['rule']['dataType']
        var match = this.monkeyRules[index]['rule']['match']


        Shimmer.wrap(exports, functionName,function(original) {
            return function () {

                if (paramIndex.length !== 0) {

                    paramIndex.forEach(paramIndex => {

                        // apply rule on specific arguments
                        let paramValue = arguments[paramIndex]

                        if (typeof paramValue == undefined && dataType == 'undefined') {
                            console.log("BLOCKED");
                        }
                        if (typeof paramValue == 'function' && dataType == 'function') {
                            paramValue = paramValue.toString()
                            console.log(paramValue);
                            console.log("APPLY RULES");
                            console.log(applyPreg(match, paramValue));
                        }
                        if (typeof paramValue == 'string' && dataType == 'string') {
                            console.log(paramValue);
                            console.log("APPLY RULES");
                            console.log(applyPreg(match, paramValue));
                        }
                        if (typeof paramValue == dataType) {
                            paramValue = JSON.stringify(paramValue)
                            console.log(paramValue);
                            console.log("APPLY RULES");
                            console.log(applyPreg(match, paramValue));
                        }
                    });

                } else {

                    // apply rule on all arguments 
                    for (const arg in arguments) {

                        let paramValue = arguments[arg]

                        if (typeof paramValue == undefined && dataType == 'undefined') {
                            console.log("BLOCKED");
                        }
                        if (typeof paramValue == 'function' && dataType == 'function') {
                            paramValue = paramValue.toString()
                            console.log(paramValue);
                            console.log("APPLY RULES");
                            console.log(applyPreg(match, paramValue));
                        }
                        if (typeof paramValue == 'string' && dataType == 'string') {
                            console.log(paramValue);
                            console.log("APPLY RULES");
                            console.log(applyPreg(match, paramValue));
                        }
                        if (typeof paramValue == dataType) {
                            paramValue = JSON.stringify(paramValue)
                            console.log(paramValue);
                            console.log("APPLY RULES");
                            console.log(applyPreg(match, paramValue));
                        }
                    }
                }
                
                var connection = original.apply(this, arguments);
                return connection;
            }
        });

    }

}

function applyPreg(rule,value)
{
    var patt = new RegExp(rule);
    return patt.test(value);
}

module.exports = monkeyPatch