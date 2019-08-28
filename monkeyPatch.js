// var Rules = require('./rules');
const Shimmer = require('shimmer');

function monkeyPatch(Agent)
{
    this._agent = Agent;
}

monkeyPatch.prototype.applyMonkey = function(rules)
{
    for (let index = 0; index < rules.length; index++) {
        // const element = rules[index];
        
        Shimmer.wrap(rules[index]['module'], rules[index]['functionName'],function(original) {
            return function () {

                if (rules[index]['param-no'].length !== 0) {
                    rules[index]['param-no'].forEach(paramIndex => {
                        // apply rule on specific arguments
                        let paramValue = arguments[paramIndex]
                        if (typeof paramValue == undefined && rules[index]['rule']['dataType'] == 'undefined') {
                            console.log("BLOCKED");
                        }
                        if (typeof paramValue == 'function' && rules[index]['rule']['dataType'] == 'function') {
                            paramValue = paramValue.toString()
                            console.log(paramValue);
                            console.log("APPLY RULES");
                        }
                        if (typeof paramValue == 'string' && rules[index]['rule']['dataType'] == 'string') {
                            console.log(paramValue);
                            console.log("APPLY RULES");
                        }
                        if (typeof paramValue == rules[index]['rule']['dataType']) {
                            paramValue = JSON.stringify(paramValue)
                            console.log(paramValue);
                            console.log("APPLY RULES");
                        }
                    });
                } else {
                    // apply rule on all arguments 
                    for (const arg in arguments) {
                        let paramValue = arguments[arg]
                        if (typeof paramValue == undefined && rules[index]['rule']['dataType'] == 'undefined') {
                            console.log("BLOCKED");
                        }
                        if (typeof paramValue == 'function' && rules[index]['rule']['dataType'] == 'function') {
                            paramValue = paramValue.toString()
                            console.log(paramValue);
                            console.log("APPLY RULES");
                        }
                        if (typeof paramValue == 'string' && rules[index]['rule']['dataType'] == 'string') {
                            console.log(paramValue);
                            console.log("APPLY RULES");
                        }
                        if (typeof paramValue == rules[index]['rule']['dataType']) {
                            paramValue = JSON.stringify(paramValue)
                            console.log(paramValue);
                            console.log("APPLY RULES");
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