var ApiClient = require('./ApiClient');

function Dispatcher(config)
{
    this.api = new ApiClient(config);
    this.events = [
        '/run',
        '/update',
        '/report'
    ];
}

Dispatcher.prototype.trigger = function(event, data = [], callback = false)
{
    if (!this.events.includes(event)) {
        return false;
    }
    this.api.request(event, data, callback);
}

module.exports = function(config){
    return new Dispatcher(config);
};