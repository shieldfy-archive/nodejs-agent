
function Judge(Agent)
{
    this._agent = Agent;
}

Judge.prototype.execute = function(req)
{
    req.shieldfy = {};
                    
    var requestPayload = this._agent.rules.check(req)

    if(req.shieldfy.isAttack){
        this._agent.http.trigger('/report',{
            attacker: {
                "ip": (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress,
                "useragent": req.headers['user-agent']
            },
            result: req.shieldfy,
            request: requestPayload    
        });
        return true
    }else{
        return false
    }
}

Judge.prototype.executeMonkey = function(paramValue, dataType, match)
{
    try {
        if (typeof paramValue == undefined && dataType == 'undefined') {
            return { isAttack: true }
        }
        if (typeof paramValue == 'function' && dataType == 'function') {
            paramValue = paramValue.toString()
            return { isAttack: applyPreg(match, paramValue) }
        }
        if (typeof paramValue == 'string' && dataType == 'string') {
            return { isAttack: applyPreg(match, paramValue) }
        }
        if (typeof paramValue == dataType) {
            paramValue = JSON.stringify(paramValue)
            return { isAttack: applyPreg(match, paramValue) }
        }
        return { isAttack: false }
    } catch (error) {
        // report to exceptions endpoint
    }
}

function applyPreg(rule,value)
{
    var patt = new RegExp(rule);
    return patt.test(value);
}


module.exports = function(Agent){
    return new Judge(Agent)
};