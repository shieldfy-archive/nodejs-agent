# Shieldfy NodeJs Runtime Agent [BETA]

This is the official Runtime Agent for Shieldfy (shieldfy.io) https://shieldfy.io

Shieldfy is a strong application protection platform that helps businesses to secure their applications online.

## Installation

1. You will first need to register on [shieldfy.io](https://shieldfy.io/) to get your APP Key.
2. install nodejs sdk package through NPM (recommanded)
    ```
    npm install shieldfy
    ```

## Usage

### open `index.js` or (main file) and type the following **on top of the file**

```js
const shieldfy = require('shieldfy')("<yourAppKey>");
// add the next line if you using express framework after require express, please include shieldfy middleware as following for more protaction and performance.
app.use(shieldfy.expressMiddleware());
```

### OR you can pass config to the initialize

```js
const shieldfy = require('shieldfy')({
    appKey : "<yourAppKey>",
    debug : false,
    action: "block"
    interval : 10000
});
// add the next line if you using express framework after require express, please include shieldfy middleware as following for more protaction and performance.
app.use(shieldfy.expressMiddleware());
```
- interval => the number of mille seconds which SDK should check our API every this interval of time for new vulenrable package.
- action => 
    - "block"
       - This is default mode in which if there exist attack on your application SDK will stop the attack and block it then report to the shieldfy dashboard.
    - "listen"
       - In this mode the SDK will not bloack any attack but it will still report this attacks to shieldfy dashboard. 


### NOTE: You should require Shieldfy in the main file at first before any other package or module in order to SDK work correctly.

    

## Testing

* Run the command into your terminal into root directory of this package
    ```bash
        npm test
    ```

## Configuration

For more information about configurations and usage, refer to the official documentation at [docs.shieldfy.io](#).

## Contributing

Thank you for considering contributing to this project!
Bug reports, feature requests, and pull requests are very welcome.


## Security Vulnerabilities

If you discover a security vulnerability within this project, please send an e-mail to `security@shieldfy.com`.
