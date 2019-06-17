var Hook = require('require-in-the-middle');
var Shimmer = require('shimmer');

function Session(Agent)
{
    this._agent = Agent;
}

Session.prototype.start = function()
{
    var Agent = this._agent;
    Hook(['http'], function (exports, name, basedir) {
        //starting of the request
        Shimmer.wrap(exports && exports.Server && exports.Server.prototype, 'emit', function (original) {
            return function (event, req, res) {
                if (event === 'request') {

                    req.shieldfy = {};
                    
                    var requestPayload = Agent.rules.check(req)
                    if(req.shieldfy.isAttack){
                        Agent.http.trigger('/report',{
                            attacker: {
                                "ip": (req.headers['x-forwarded-for'] || '').split(',')[0] || req.connection.remoteAddress,
                                "useragent": req.headers['user-agent']
                            },
                            result: req.shieldfy,
                            request: requestPayload    
                        });
                    }

                    arguments[1] = req; //replace the request with our modified version
                }   
                var returned = original.apply(this, arguments);
                return returned;
            };
        });

        //ending of the request
        return exports;
    });
}

module.exports = function(Agent)
{
    return new Session(Agent)
};