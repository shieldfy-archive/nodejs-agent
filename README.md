# Shieldfy NodeJs-Vulnerablity SDK 

This is the official NodeJs-Vulnerablity SDK for Shieldfy (shieldfy.io) https://shieldfy.io

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
require('shieldfy')("<yourAppKey>");
```

### OR you can pass config to the initialize

```js
const shieldfy = require('shieldfy');
shieldfy({
    appKey : "<yourAppKey>",
    debug : false,
    interval : 10000
});
```
- interval => the number of mille seconds which SDK should check our API every this interval of time for new vulenrable package.


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
