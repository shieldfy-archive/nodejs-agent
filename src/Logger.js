function Logger(debugMode) {
    return function (msg)
    {        
        if (debugMode) {
            console.log(msg);
        }
    }
}

module.exports = Logger;