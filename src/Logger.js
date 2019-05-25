module.exports = {
    raw: function(msg){
        process._rawDebug(msg)
    },
    console: function(msg){
        console.log(msg);
    }
}