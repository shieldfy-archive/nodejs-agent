var Judge = require('../Judge');

function ExpressMiddleware(Agent)
{
    this._agent = Agent;
    this.judge = Judge(Agent);
}

ExpressMiddleware.prototype.check = function(req, res, next)
{    
    this.judge.execute(req);
    next();
}

module.exports = function(Agent){
    return new ExpressMiddleware(Agent)
};