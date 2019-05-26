var url = require("url");

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
    cookiesObj = extractCookies(req);
    if (!cookiesObj) {
        // return something
    }

    for (var key in cookiesObj) {
        var value = cookiesObj[key];
        var result = this.applyPreg(this._rule.match, value);
        /** fix req */
        if(result) {
            req.headers.cookie = filterCookies(req.headers.cookie, key, value);
            // return something
        }
    }
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


function extractCookies(req) {
    var str = req.headers.cookie || '';
    
    if (!str || typeof str !== 'string') {
        return;
    }

    var pairs = str.split('; '); 
    var obj = {};

    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        var eq_idx = pair.indexOf('=');
    
        // skip things that don't look like key=value
        if (eq_idx < 0) {
          continue;
        }
    
        var key = pair.substr(0, eq_idx).trim();
        var val = pair.substr(++eq_idx, pair.length).trim();
    
        // quoted values
        if ('"' == val[0]) {
          val = val.slice(1, -1);
        }
    
        // decoding value
        if (obj[key] == undefined) {
            try {
                obj[key] = decodeURIComponent(val);
            } catch (e) {
                obj[key] = val;
            }
        }
    }
    
    return obj;
}

function filterCookies(str) {

}

module.exports = Rule;
