var Block = require('../src/block/index');
var httpMocks = require('node-mocks-http');

describe("Block",function () {

    describe(".run",function () {
        var request  = httpMocks.createRequest({
            method: 'GET',
            url: 'http://www.test.com/../../../'
        });
        var response = httpMocks.createResponse({
            req: request
        })

        it("should block the response and set 403 status code",function () {
            Block().run("block-id", response)

            expect(response.statusCode).toEqual(403);
        })
    });
});