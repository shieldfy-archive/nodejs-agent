# Shieldfy NodeJs-Vulnerablity SDK 

This is the official NodeJs-Vulnerablity SDK for Shieldfy (shieldfy.io) https://shieldfy.io

Shieldfy is a strong application protection platform that helps businesses to secure their applications online.

## Installation

1. You will first need to register on [shieldfy.io](https://shieldfy.io/) to get your APP Key.
2. install nodejs sdk package through NPM (recommanded)
    ```
    npm install shieldfy-nodejs-vulnerablity-client
    ```

## Usage

### open `index.js` or (main file) and type the following:

`index.js` File
```js
const shieldfy = require('shieldfy-nodejs-vulnerablity-client');
shieldfy("<yourAppKey>");
```

### OR

```js
const shieldfy = require('shieldfy-nodejs-client');
shieldfy({
    appKey : "<yourAppKey>",
    debug : false,
    interval : 10000
});
```
- interval => the number of mille seconds which SDK should check our API every this interval of time for new vulenrable package.

### Or, in case using environment variable (`.env` File)

`index.js` File
```js
const shieldfy = require('shieldfy-nodejs-client');
shieldfy();
```

`.env` File
```js
shieldfyAppKey = "yourAppKey"
shieldfyDebug = false
shieldfyInterval = 10000
```

### NOTE: You should require Shieldfy in the main file at first before any other package or module in order to SDK work correctly.

    


## Configuration

For more information about configurations and usage, refer to the official documentation at [docs.shieldfy.io](#).

## Contributing

Thank you for considering contributing to this project!
Bug reports, feature requests, and pull requests are very welcome.


## Security Vulnerabilities

If you discover a security vulnerability within this project, please send an e-mail to `security@shieldfy.com`.
