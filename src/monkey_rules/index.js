const fs = require('fs');

function MonkeyRules(monkeyRules, Agent)
{
    this.monkeyRules = monkeyRules;
    this._agent = Agent;
    this.save();
}

MonkeyRules.prototype.save = function()
{
    fs.writeFile(__dirname+'/rules.json', JSON.stringify(this.monkeyRules), (err) => {
        if (err) {
            // report to exceptions endpoint
            this._agent.http.trigger('/exception', {
                errorMessage: err,
                config: this._agent._config
            });
        }
    });
}

module.exports = MonkeyRules;