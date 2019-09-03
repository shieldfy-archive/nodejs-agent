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
            var dataType = this.monkeyRules[index]['rule']['dataType']
            var match = this.monkeyRules[index]['rule']['match']

            Shimmer.wrap(exports, functionName,(original) =>{
                return function () {

                    if (paramIndcies.length !== 0) {

                        paramIndcies.forEach(paramIndex => {
                            // apply rule on specific arguments
                            let paramValue = arguments[paramIndex]
                            let result = _Judge.executeMonkey(paramValue, dataType, match)
                            // TODO: check for action when you merge to master branch
                            if (result.isAttack) {
                                throw new Error('shieldfy catched attack');
                                return
                            }
                        });
                    } else {
                        // apply rule on all arguments 
                        for (const arg in arguments) {
                            let paramValue = arguments[arg]
                            let result = _Judge.executeMonkey(paramValue, dataType, match)
                            // TODO: check for action when you merge to master branch
                            if (result.isAttack) {
                                throw new Error('shieldfy catched attack');
                                return 
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

module.exports = monkeyPatch