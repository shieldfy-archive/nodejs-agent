var Logger = require('../src/Logger');

describe("Logger",function () {
    var agent;
    
    beforeEach(function() {
        agent = {
          log: new Logger(true)
        };
        spyOn(agent, 'log');

        agent.log('This is a test');
    });

    it("logger should be called",function () {
        expect(agent.log).toHaveBeenCalled();
    });
});