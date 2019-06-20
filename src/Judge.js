
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
    }
}

module.exports = function(Agent){
    return new Judge(Agent)
};