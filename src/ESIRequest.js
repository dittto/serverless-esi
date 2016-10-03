'use strict';

module.exports = class ESIRequest {
    constructor(s3, defaultParams) {
        this.s3 = s3;
        this.defaultParams = defaultParams;
    }

    sendRequest(body, paths) {
        const promises = [];
        for (let path of paths) {
            promises[promises.length] = new Promise((resolve, reject) => {
                this.getESI(path, resolve, reject);
            });
        }

        return new Promise((resolve, reject) => {
            Promise.all(promises).then(values => {
                this.parseESI(values, resolve, reject, body);
            }, reasons => {
                reject(reasons);
            });
        });
    }

    getESI(path, resolve, reject) {
        const params = Object.assign(this.defaultParams, {Key: path});

        // an s3 getObject request for each path
        this.s3.getObject(
            params, (err, data) => {
                if (err) {
                    reject(err.stack);
                }
                resolve({
                    path: path,
                    body: data.Body.toString('utf-8')
                });
            }
        );
    }

    parseESI(values, resolve, reject, body) {
        // replace the body with the values
        for (let value of values) {
            if (!body) {
                body = value.body;
                continue;
            }
            body = body.replace('<%--' + value.path + '--%>', value.body);
        }

        // gets the next set of ESIs
        const includeRegex = /<esi:include.*src="([^"]*)"[^>]*>/gi;
        const matches = includeRegex.exec(body);
        if (!matches) {
            resolve(body);
        }

        console.log(matches);
        body = body.replace(matches[0], '<%--' + matches[1] + '--%>');
        const urls = [];
        urls[urls.length] = matches[1];

        const subPromise = this.sendRequest(body, urls);
        subPromise.then(bodyHtml => {
            resolve(bodyHtml);
        }, reasons => {
            reject(reasons);
        });
    }
};
