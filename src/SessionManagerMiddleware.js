var Judge = require('./Judge');

function SessionMiddleware(Agent)
{
    this._agent = Agent;
    this.judge = Judge(Agent);
}

SessionMiddleware.prototype.check = function(req, res, next)
{
    console.log('I am here');
    
    this.judge.execute(req);
    // req.shieldfy = {};
                    
    // var requestPayload = this._agent.rules.check(req)

    // if(req.shieldfy.isAttack){
    //     this._agent.http.trigger('/report',{
    //         attacker: {
    //             "ip": (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress,
    //             "useragent": req.headers['user-agent']
    //         },
    //         result: req.shieldfy,
    //         request: requestPayload    
    //     });
    // }

    next();
}

module.exports = function(Agent){
    return new SessionMiddleware(Agent)
};