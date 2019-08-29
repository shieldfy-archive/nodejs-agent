var Rules = require('./rules');
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
    this._agent.http.trigger('/update',{},function(data){        
        if(data.status == 'success'){            
            self._agent.rules = new Rules(data.rules, self._agent);
            self._agent.log('rules updated successfully');
        }
    });

    if (isServerless.result) {
        self._agent.log('The code is running on a serverless environment : ' + isServerless.whichOne);
    } else {
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