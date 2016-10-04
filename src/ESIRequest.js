'use strict';

module.exports = class {
    constructor(fileHandler) {
        this.fileHandler = fileHandler;
    }

    sendRequest(body, paths) {
        // sets up promises for all paths to retrieve
        const promises = [];
        for (let path of paths) {
            promises[promises.length] = new Promise((resolve, reject) => {
                this.fileHandler.get(path, resolve, reject);
            });
        }

        // when all promises have been resolved, parse the results into the body
        return new Promise((resolve, reject) => {
            Promise.all(promises).then(values => {
                this.parseESI(values, resolve, reject, body);
            }, reasons => {
                reject(reasons);
            });
        });
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
        body = body.replace(matches[0], '<%--' + matches[1] + '--%>');
        const urls = [];
        urls[urls.length] = matches[1];

        // parse other ESI commands

        // send a request for the new esi urls
        const subPromise = this.sendRequest(body, urls);
        subPromise.then(bodyHtml => {
            resolve(bodyHtml);
        }, reasons => {
            reject(reasons);
        });
    }
};
