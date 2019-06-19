var SessionManager = require('../src/SessionManager');
var http = require('../src/http');

var session = SessionManager({
    http:http({
        'endPoint' : 'https://api.shieldfy.com',
        'appKey' : 'testKey'
    })
})

describe("Session",function () {    
    it("should be successfuly initialized",function () {
        expect(typeof(SessionManager)).toEqual('function');
        expect(typeof(session.start)).toEqual('function');
        expect(session._agent.http.api.appKey).toEqual('testKey');
        expect(session._agent.http.api.endPoint.href).toEqual('https://api.shieldfy.com/');
        expect(session._agent.http.events[2]).toEqual('/report');
    });
    
});