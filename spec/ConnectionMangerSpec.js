var ConnectionManager = require('../src/ConnectionManager');
var http = require('../src/http');
var nock = require('nock');
var Logger = require('../src/Logger');

describe("ConnectionManager",function () {
    var connector = ConnectionManager({
        _config:{
            interval:5000
        },
        http:http({
            'endPoint' : 'https://api.shieldfy.com',
            'appKey' : 'testKey'
        }),
        log:new Logger(false)
    });
    var connectionManager;
    connector.start()
    beforeEach(function(done) {

        nock('https://api.shieldfy.com')
            .post('/update')
            .reply(200, {
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
            }); 

        connectionManager = {
          call: connector.call,
          scheduleNextcall: connector.scheduleNextcall
        };
        spyOn(connector, 'call');
        spyOn(connector, 'scheduleNextcall');
        
        connector.start();
        done();
    });

    it("should be initialized successfuly",function (done) {        
        expect(connector._agent._config.interval).toEqual(5000);
        expect(connector._agent.http.api.endPoint.href).toEqual('https://api.shieldfy.com/');
        expect(connector._agent.http.api.appKey).toEqual('testKey');
        done();
    });

    it("call function should be called",function (done) {
        expect(connector.call).toHaveBeenCalled();
        done();
    });
    
    it("scheduleNextcall function should be called",function (done) {
        connector.scheduleNextcall()
        expect(connector.scheduleNextcall).toHaveBeenCalled();
        done();
    });
});