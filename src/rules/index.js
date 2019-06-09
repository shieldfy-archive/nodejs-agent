var Rule = require('./rule');
var Logger = require('../Logger');

function Rules(rules, Agent)
{
    var rulesBank = {};
    for (let index = 0; index < rules.length; index++) {
        rulesBank[rules[index].id] = new Rule(rules[index]);
    }
    this.rulesBank = rulesBank;
    this._agent = Agent;
}

Rules.prototype.check = function(req)
{
    var requestPayload = this.preapareRequestForPayload(req);

    var rulesBank = this.rulesBank;
    for (var key in rulesBank) {
        
        if (!(rulesBank[key]._module in this._agent._loadedModules)) {            
            continue;
        }

        var result = rulesBank[key].match(req); 
        req.shieldfy = result;
        if(result.isAttack){
            break; //attack is spotted , no need to apply remaining rules
        }
    }

    return requestPayload;
}   

Rules.prototype.preapareRequestForPayload = function(req)
{
    return {
        statusCode: req.statusCode,
        statusMessage: req.statusMessage,
        headers: req.headers,
        trailers: req.trailers,
        url: req.url,
        method: req.method,
    }
}

module.exports = Rules;