'use strict';

module.exports = class {
    constructor(fileHandler, esiParser) {
        this.fileHandler = fileHandler;
        this.esiParser = esiParser;
    }

    sendRequest(parsedBody) {
        // sets up promises for all paths to retrieve
        const promises = [];
        for (let path of parsedBody.getUrls()) {
            promises[promises.length] = this.fileHandler.get(path);
        }

        // when all promises have been resolved, parse the results into the body
        return new Promise((resolve, reject) => {
            Promise.all(promises).then(values => {

                // replace existing tags with html
                const body = this.esiParser.replacePathsWithHtml(parsedBody.getBody(), values);

                // retrieve the new urls and replace with tags
                const subParsedBody = this.esiParser.getPaths(body);
                if (!subParsedBody.hasUrls()) {
                    return resolve(body);
                }

                const subPromise = this.sendRequest(subParsedBody);
                subPromise.then(bodyHtml => {
                    return resolve(this.esiParser.parseConditionals(bodyHtml));
                }, reasons => {
                    return reject(reasons);
                });

            }, reasons => {
                reject(reasons);
            });
        });
    }
};
