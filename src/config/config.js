const _ = require("lodash");
const path = require("path");
const glob = require("glob");

let getGlobbedPaths = function (globPatterns, excludes) {
    let urlRegex = new RegExp("^(?:[a-z]+:)?\/\/", "i");

    let output = [];

    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function (globPattern) {
            output = _.union(output, getGlobbedPaths(globPattern, excludes));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            let files = glob.sync(globPatterns);
            if (excludes) {
                files = files.map(function (file) {
                    if (_.isArray(excludes)) {
                        for (let i in excludes) {
                            if (excludes.hasOwnProperty(i)) {
                                file = file.replace(excludes[i], "");
                            }
                        }
                    } else {
                        file = file.replace(excludes, "");
                    }
                    return file;
                });
            }
            output = _.union(output, files);
        }
    }

    return output;
};

async function initEnvironmentVariables() {
    require('dotenv').config();

    const nodecache = require(path.join(process.cwd(), 'src/config/lib/nodecache'));

    const secrets = { secret1: 'secret1', secret2: 'secret2' }; // more secrets, if any from cloud

    for (const key in secrets) {
        if (secrets.hasOwnProperty(key)) {
            nodecache.setValue(key, secrets[key]);
        }
    }
}

function getGlobalConfig() {
    const assets = require(path.join(process.cwd(), "src/config/assets/default"));

    let config = {
        routes: getGlobbedPaths(assets.routes),
        strategies: getGlobbedPaths(assets.strategies)
    };

    return config;
}

exports.getGlobalConfig = getGlobalConfig;
exports.initEnvironmentVariables = initEnvironmentVariables;
