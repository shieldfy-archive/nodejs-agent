const fs = require('fs');
const https = require('https');
const util = require('util');
const glob = require('glob');
const semver = require('semver');
const exec = util.promisify(require('child_process').exec);

let json = fs.readFileSync('.shieldfy', 'utf8')
json = JSON.parse(json)
const packages = Object.keys(json)

glob(`node_modules/**/+(${packages.toString().replace(/,/g, '|')})`, {}, function (err, files) {
    files.map(async (path) => {        
        for (const [key, value] of Object.entries(packages)) {
            if (path.includes(value)) {
               await verifyPackageVersion(path, json[value])
            }
        }
    })
})

const verifyPackageVersion = (path, versionPackage) => {
    try {
        const versions = Object.keys(versionPackage)
        let package = fs.readFileSync(`${path}/package.json`, 'utf8')
        package = JSON.parse(package)    
        const { version } = package        
        versions.map(ver => {
            if (semver.satisfies(version, ver)) {
                versionPackage[ver].map(async url => {
                    await readAndWrite(url, path)
                    await applyPatch(path)
                })
            }
        })
    } catch (error) {
        console.log('rw',error);
    }
}

const readAndWrite = async (url, path) => {
    try { 
        console.log(url,path );
        const file = fs.createWriteStream(`${path}/sim.patch`);
        https.get(url, response => response.pipe(file));
    } catch (error) {
        console.log('rw',error);
    }
}

const applyPatch = async dir => {
    try {
        await exec(`patch -f -p 1 -i sim.patch -d ${dir}`);
    } catch (error) {
        console.log('apply',error);
    }
}