'use strict';

module.exports = class {
    constructor(s3, defaultParams) {
        this.s3 = s3;
        this.defaultParams = defaultParams;
    }

    get(path, resolve, reject) {
        const params = Object.assign(this.defaultParams, {Key: path});

        this.s3.getObject(
            params, (err, data) => {
                if (err) {
                    return reject(err.stack);
                }
                if (!data) {
                    return reject("Missing template " + path);
                }
                resolve({
                    path: path,
                    body: data.Body.toString('utf-8')
                });
            }
        );
    }
};
