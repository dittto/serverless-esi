'use strict';

module.exports = class {
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
                resolve({
                    path: path,
                    body: data.Body.toString('utf-8')
                });
            }, error => {
                console.log(error);
                return reject(error.stack);
            });
        });
    }
};
