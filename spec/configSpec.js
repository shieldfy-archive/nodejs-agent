var Config = require('../src/config');

describe("Config",function () {

    it("with string parameter",function () {
        opts = "testKey";
        config = new Config().setConfig(opts);
        expect(config.appKey).toEqual("testKey");
        expect(config.debug).toEqual(false);
        expect(config.interval).toEqual(10000);
    });

    it("with object parameter",function () {
        opts = {
            appKey :'testKey',
            debug : true,
            interval : 100000
        }
        
        config = new Config().setConfig(opts);
        expect(config.appKey).toEqual("testKey");
        expect(config.debug).toEqual(true);
        expect(config.interval).toEqual(100000);
    });

    it("without any parameter",function () {
        var opts
        config = new Config().setConfig(opts);
        expect(config.appKey).toEqual(null)
        expect(config.debug).toEqual(false);
        expect(config.interval).toEqual(10000);
    });

    it("with environment parameter",function () {
            require('dotenv').config({ path: 'spec/.env' })
            config = new Config().setConfig();
            expect(config.appKey).toEqual("test environment key")
            expect(config.debug).toEqual(false);
            expect(config.interval).toEqual(10000);
    });
});