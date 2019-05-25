var url = require("url");
var getRawBody = require('raw-body')
var bodyParser = require('body-parser');

function Rule(obj)
{
    this._id = obj.id;
    this._module = obj.module;
    this._version  = obj.version;
    this._param = obj.param;
    this._rule = obj.rule;
}


Rule.prototype.match = function(req)
{
    var parsedURL = url.parse(req.url, true); // .query

    switch (this._param.type) {
        case "pathname":
            return this.matchPathname(req,parsedURL);
            break;
        case "query":
            return this.matchQuery(req,parsedURL);
            break;
        case "data":
            return this.matchData(req,parsedURL);
            break;
        case "cookie":
            return this.matchCookie(req,parsedURL);
            break;
    }
}

Rule.prototype.matchPathname = function(req,parsedURL)
{
    var path = parsedURL.pathname;
    var result = this.applyPreg(this._rule.match,path);

    /** fix req */
    if(result){
        req.url = '/'; //request passed by ref so we can edit on it
    }

    return this.buildResult(result,'pathname');
}

Rule.prototype.matchQuery = function(req)
{
    var query = parsedURL.query;
    var result = false;

    for (var key in query) {
        var value = query[key];
        var result = this.applyPreg(this._rule.match,value);
        /** fix req */
        if(result){
            req.url = '/'; //request passed by ref so we can edit on it
            return this.buildResult(result,key);
        }
    }

    return this.buildResult(result,'');
}

Rule.prototype.matchData = function(req)
{
    
    
}

Rule.prototype.matchCookie = function(req)
{
    
}

Rule.prototype.applyPreg = function(rule,value)
{
    var patt = new RegExp(rule);
    return patt.test(value);
}

Rule.prototype.buildResult = function(isAttack,paramName)
{
    return {
        isAttack : isAttack,
        rule : this._id,
        param : {
            type : this._param.type,
            name : paramName 
        }
    }
}

module.exports = Rule;
