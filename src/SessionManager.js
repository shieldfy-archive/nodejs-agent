var Hook = require('require-in-the-middle');
var Shimmer = require('shimmer');
var Logger = require('./Logger');


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


                    /**
                     * 
                     * Prepare Body if method == post
                     * 
                     */

                    // let body = []
                    // req.on('data', chunk => {
                    //     body.push(chunk)
                    //     // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
                    //     if (body.length > 1e6) { 
                    //         // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                    //         console.log('Too Many Data');
                    //         //request.connection.destroy();
                    //     }
                    // });
                    // req.on('end', () => {
                    //     //JSON.parse(data).todo // 'Buy the milk'
                    //     //console.log('BodyNow',body);
                    //     req.body = body;
                    // });


                    /**
                     * 
                     * End prepare body
                     *
                     * */

                    req.shieldfy = {};
                    // console.log('URL --------------------');
                    // var parsedURL = url.parse(req.url, true);                  
                    // console.log(parsedURL.query);
                    // console.log('---------------------URL');
                    //console.log('Agent first');
                    //function (req, res, next)
                    var requestPayload = Agent.rules.check(req)
                    if(req.shieldfy.isAttack){
                        //console.log('E2fesh Attack 2');
                        //console.log(req);
                        Agent.http.trigger('/report',{
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