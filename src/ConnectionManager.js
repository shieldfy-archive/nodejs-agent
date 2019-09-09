var Rules = require('./rules');
var MonkeyRules = require('./monkey_rules/index');
var isServerless = require('is-serverless')

function Connector(Agent)
{
    this._agent = Agent;
    this._interval = Agent._config.interval; //suppose to be 1 minute interval (1440 call / day)
}

Connector.prototype.start = function()
{
    this.call();
}

Connector.prototype.call = function()
{
    this._agent.log('-> Calling the API');
    var self = this;
    this._agent.http.trigger('/update',{},function(response){    
        
        if(response.status == 'success'){                        
            self._agent.rules = new Rules(response.data.rules, self._agent);
            self._agent.log('rules updated successfully');
            self._agent.monkeyRules = new MonkeyRules(response.data.monkey_rules, self._agent)
            self._agent.log('monkeyRules updated successfully');
        }
    });

    if (isServerless.result) {
        self._agent.log('The code is running on a serverless environment : ' + isServerless.whichOne);
    } else {
        if (!this._agent._config.update) return
        this.scheduleNextcall();
    }
}

Connector.prototype.scheduleNextcall = function()
{
    var self = this;
    setTimeout(function(){
        self.call();
    },this._interval);
}


module.exports = function(Agent){
    return new Connector(Agent)
};