function Config() {
    this._defaults = {
      "sdkVersion" : "0.0.1",
      "endPoint" : 'https://ci.shieldfy.io/api',
      "appKey" : null,
      "debug" : false,
      "interval" : 30000,
      "action": "block",
    };
}

Config.prototype.setConfig = function (opts)
{
    if (process.env.shieldfyAppKey !== undefined) {
        
        var EnvOpts = {
            'appKey' : process.env.shieldfyAppKey,
            'debug' : process.env.shieldfyDebug == "true" ? true : false,
            'interval' : process.env.shieldfyInterval ? parseInt(process.env.shieldfyInterval) : 10000,
            'endPoint' : process.env.shieldfyEndPoint ? process.env.shieldfyEndPoint : 'https://ci.shieldfy.io/api',
            'action' : process.env.shieldfyAction ? process.env.shieldfyAction : 'block',
        };        
        Object.assign(this._defaults, EnvOpts);

    }else if (typeof(opts) == "string") {

        this._defaults.appKey = opts;

    }else {

        Object.assign(this._defaults, opts);

    }
    return this._defaults;
}

module.exports = Config;
  