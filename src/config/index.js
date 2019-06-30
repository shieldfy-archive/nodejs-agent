function Config() {
    this._defaults = {
      "sdkVersion" : "0.0.1",
      "endPoint" : 'https://ci-dev.shieldfy.co/',
      "appKey" : null,
      "debug" : false,
      "interval" : 30000
    };
}

Config.prototype.setConfig = function (opts)
{
    if (process.env.shieldfyAppKey !== undefined) {
        
        var EnvOpts = {
            'appKey' : process.env.shieldfyAppKey,
            'debug' : process.env.shieldfyDebug == "true" ? true : false,
            'interval' : process.env.shieldfyInterval ? parseInt(process.env.shieldfyInterval) : 10000
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
  