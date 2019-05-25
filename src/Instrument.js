var Hook = require('require-in-the-middle');
var path = require('path');
var fs = require('fs');
var Logger = require('./Logger');

function Instrument(Agent)
{   
  this._agent = Agent;
  this._hook();
}

Instrument.prototype._hook = function()
{
    var self  = this;
    Hook(null, function (exports, name, basedir) {
        var pkg, version
    
        if (basedir) {
          pkg = path.join(basedir, 'package.json')
          try {
            version = JSON.parse(fs.readFileSync(pkg)).version
          } catch (e) {
            Logger.console('could not shim '+name+' module: '+e.message)
            return exports
          }
        } else {
          version = process.versions.node
        }
    
        return self._patch(exports, name, version)
    });  
}

Instrument.prototype._patch = function(exports, name, version)
{
    Logger.console('shimming '+name+'@'+version+' module');
    this._agent._loadedModules[name] = version;
    return exports;
}
module.exports = Instrument;