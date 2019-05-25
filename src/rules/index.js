var Rule = require('./rule');
var Logger = require('../Logger');

function Rules(rules)
{
    var rulesBank = {};
    for (let index = 0; index < rules.length; index++) {
        rulesBank[rules[index].id] = new Rule(rules[index]);
    }
    this.rulesBank = rulesBank;
    //return rulesBank;
    //console.log(rulesBank);
}

Rules.prototype.check = function(req)
{
    // var result;
    var requestPayload = this.preapareRequestForPayload(req);

    var rulesBank = this.rulesBank;
    for (var key in rulesBank) {
        var result = rulesBank[key].match(req); 
        //console.log(result);
        req.shieldfy = result;
        if(result.isAttack){
            // req.shieldfy.isAttack = true;
            // req.shieldfy.result = rulesBank[key].getInfo();
            Logger.console('E2fesh Attack' + req.url);
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