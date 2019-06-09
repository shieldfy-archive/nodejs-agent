function Config() {
    this._defaults = {
      "sdkVersion" : "0.0.1",
      "endPoint" : 'https://api.shieldfy.com/v2/',
      "appKey" : null,
      "debug" : false,
      "interval" : 10000
    };
}

Config.prototype.setConfig = function (opts)
{
    if (process.env.shieldfyAppKey !== undefined) {

        var EnvOpts = {
            'appKey' : process.env.shieldfyAppKey,
            'debug' : process.env.shieldfyDebug
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
  