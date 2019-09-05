var Judge = require('../Judge');
var Block = require('../block')
var uuidv4 = require('uuid/v4');

function ExpressMiddleware(Agent)
{
    this._agent = Agent;
    this.judge = Judge(Agent);
}

ExpressMiddleware.prototype.check = function(req, res, next)
{    
    var result = this.judge.execute(req);
    if (result && this._agent._config.action != 'listen') {
        Block().run(uuidv4(),res);
    }else{
        next();
    }
}

module.exports = function(Agent){
    return new ExpressMiddleware(Agent)
};