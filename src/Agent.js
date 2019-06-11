var Config = require('./config');
var path = require('path')
var Instrument = require('./Instrument');
var Rules = require('./rules');
var SessionManager = require('./SessionManager');
var ConnectionManager = require('./ConnectionManager');
var http = require('./http');
var Logger = require('./Logger');

// var rules = [
//     {
//         "id":"x-1-1-1",
//         "module":"algo-httpserv",
//         "function":"serve",
//         "version":"<1.1.2",
//         "param":{
//             type:"pathname", //query, data, cookie, pathname
//             name:"*"
//         },
//         "rule":{
//             "type":"preg",
//             "match":"..[\\/\\\\]+"
//         }
//     }
// ];

var rules = [];


function Agent ()
{
    this._loadedModules = {};
    this._config = null;
    this.rules = null;
    this.sessionManager = null;
    this.connector = null;
    this.http = null;
    this.Instrumenter = null;
}

Agent.prototype.start = function(opts)
{
    this._config = new Config().setConfig(opts);
    this.log = new Logger(this._config.debug);
    this.log('Statring Shieldfy Agent');
    var baseDir = path.dirname(process.argv[1]);
    try {
        var pkg = require(path.join(baseDir, 'package.json'));
        var pkgLock = require(path.join(baseDir, 'package-lock.json'));
    } catch (e) {}

    this._info = {
        pid: process.pid,
        ppid: process.ppid,
        arch: process.arch,
        platform: process.platform,
        process_version: process.version,
        app_main: pkg && pkg.main,
        service_name: pkg && pkg.name,
        packages_lock:  pkgLock && pkgLock.dependencies,
        packages: pkg && pkg.dependencies,
    };

    this.http = http({
        'endPoint' : this._config.endPoint,
        'appKey' : this._config.appKey
    });
    
    this.http.trigger('/run',{
        info:this._info
    });

    this.Instrumenter = new Instrument(this);    
    this.rules = new Rules(rules, this);
    this.sessionManager = SessionManager(this).start();
    this.connector = ConnectionManager(this).start();
}


module.exports = Agent;