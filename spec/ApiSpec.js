var Http = require('../src/http');
var nock = require('nock');
 

describe("Http",function () {
    
    var http = Http({
        'endPoint' : 'https://api.shieldfy.com',
        'appKey' : 'testKey'
    })
    
    it("should be successfuly intialized",function () {
        
        expect(http.api.appKey).toEqual('testKey');
        expect(http.api.endPoint.href).toEqual('https://api.shieldfy.com/');
        
    });
    
});

describe("Http Requests",function () {
    
    var http = Http({
        'endPoint' : 'https://api.shieldfy.com',
        'appKey' : 'testKey'
    })
    
    beforeEach(function(done) {
        nock('https://api.shieldfy.com')
            .post('/run')
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
        var returnedData;
        http.trigger('/run', [], (data)=>{            
            this.returnedData = data;
            done();
        });
    });

    it("run event should be triggered",function (done) {
        
        expect(typeof(this.returnedData)).toEqual('object');
        expect(Object.keys(this.returnedData)[0]).toEqual('id');
        expect(this.returnedData['id']).toEqual('x-1-1-1');
        expect(this.returnedData['module']).toEqual('vulnerable-module');
        expect(this.returnedData['param']['type']).toEqual('pathname');
        expect(this.returnedData['rule']['type']).toEqual('preg');
        done();

    });

});