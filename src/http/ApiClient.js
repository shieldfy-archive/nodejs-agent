var http = require('http');
var https = require('https');
var url = require('url');

/**
 *
 * @param config
 */
function ApiClient(config) {    
    this.appKey = config.appKey;
    this.endPoint = url.parse(config.endPoint);
    this.https = this.endPoint.protocol == 'https:' ? true : false;
}

ApiClient.prototype.setupHeader = function(length)
{
    return {
        'Authorization': 'Bearer '+this.appKey,
        'Content-Type': 'application/json',
        'Content-Length': length
    };
}


ApiClient.prototype.request = function(url, body, callback = false)
{
    var data = JSON.stringify(body);

    var options = {
        hostname: this.endPoint.hostname,
        port: this.https ? 443 : 80,
        path: this.endPoint.pathname == '/' ? url : this.endPoint.pathname + url,
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
                }catch(e){
                    callback && callback("ERROR IN PARSING");
                }
            });
        }else{            
            //report an error
            callback && callback('ERROR IN Status code'+res.statusCode);
        }
    }

    if(this.https){
        var req = https.request(options, requestCallback);
    }else{
        var req = http.request(options, requestCallback);
    }
    
    req.on('error', (error) => {
        //report an error
        console.log('Request error ', error);
    })
    
    req.write(data);
    req.end();
}

module.exports = ApiClient;
