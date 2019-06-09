var http = require('http');
var https = require('https');
var { URL } = require('url');


/**
 *
 * @param config
 */
function ApiClient(config) {    
    this.appKey = config.appKey;
    this.endPoint = new URL(config.endPoint);
}

ApiClient.prototype.setupHeader = function(length)
{
    return {
        'Authentication': this.appKey,
        'Content-Type': 'application/json',
        'Content-Length': length
    };
}


ApiClient.prototype.request = function(url, body, callback = false)
{
    var data = JSON.stringify(body);

    var options = {
        hostname: this.endPoint.hostname,
        port: this.endPoint.protocol == 'https:' ? 443 : 80,
        path: url,
        method: 'POST',
        headers: this.setupHeader(data.length)
    }

    if(this.endPoint.port){
        options.port = this.endPoint.port;
    }

    function requestCallback(res)
    {
        if(res.statusCode == 200){
            res.on('data', function(data) {
                try{
                    callback && callback(JSON.parse(data.toString()));
                }catch(e){}
            });
        }else{
            //report an error
        }
    }

    if(this.https){
        var req = https.request(options, requestCallback);
    }else{
        var req = http.request(options, requestCallback);
    }
    
    req.on('error', (error) => {
        //report an error
    })
    
    req.write(data);
    req.end();
}

module.exports = ApiClient;
