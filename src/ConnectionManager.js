var Rules = require('./rules');

function Connector(Agent)
{
    this._agent = Agent;
    this._interval = 10000; //suppose to be 1 minute interval (1440 call / day)
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
            self._agent.rules = new Rules(data.rules);
            this._agent.log('rules updated successfully');
        }
    });

    this.scheduleNextcall();
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