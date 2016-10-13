'use strict';

const FileResponse = require('./FileResponse.js');

class S3Handler {
    constructor(s3, defaultParams) {
        this.s3 = s3;
        this.defaultParams = defaultParams;
    }

    get(path) {
        const params = Object.assign(this.defaultParams, {Key: path});

        return new Promise((resolve, reject) => {
            this.s3.getObject(params).promise().then(data => {
                if (!data) {
                    return reject("Missing template " + path);
                }

                return resolve(new FileResponse(
                    path,
                    data.Body.toString('utf-8'),
                    this.getCacheTimeFromString(data.CacheControl || null)
                ));
            }, error => {
                console.log("S3");
                console.log(error);
                return reject(error.stack);
            });
        });
    }

    getCacheTimeFromString(cacheControl) {
        if (cacheControl) {
            return cacheControl.match(/([0-9]+)/)[0];
        }

        return 0;
    }
}

module.exports = S3Handler;
