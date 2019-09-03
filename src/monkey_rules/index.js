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
            console.log(err);
            
            // report to exceptions endpoint
        }
    });
}

module.exports = MonkeyRules;