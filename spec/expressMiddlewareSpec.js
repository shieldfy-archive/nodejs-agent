var ExpressMiddleware = require('../src/Middlewares/expressMiddleware');
var httpMocks = require('node-mocks-http');
var Rules = require('../src/rules');
var Agent = require('../src/Agent');
var key = "testKey";
var agent = new Agent();
agent.start(key);

describe("Express Middleware",function () {

    var rulesList = [
        {
            "id" : "x-1-1-1",
            "module" : "vulnerable-module",
            "function" : "test",
            "version" : "<1.1.1",
            "param" : {
                "type" : "pathname",
                "name" : "*"
            },
            "rule" : {
                "type" : "preg",
                "match" : "..[\\/\\\\]+"
            }
        }
    ];
    agent.rules = new Rules(rulesList, agent);
    agent.rules._agent._loadedModules["vulnerable-module"] = "<1.1.1"

    describe(".check",function () {
        var request  = httpMocks.createRequest({
            method: 'GET',
            url: 'http://www.test.com/../../../'
        });
        request.connection = { remoteAddress: '127.0.0.1'}
        var response = httpMocks.createResponse({
            req: request
        })

        it("should block the response",function () {
            var expressMiddleware = ExpressMiddleware(agent)
            expressMiddleware.check(request, response, ()=>{})

            expect(response.statusCode).toEqual(403);
        })
    });
});