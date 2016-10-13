'use strict';

const ESIResponse = require('./ESIResponse.js');

class ESIRequest {
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
            Promise.all(promises).then(fileResponses => {

                // gets the lowest cache time from all file responses
                const cacheTime = this.getLowestCacheTime(fileResponses);

                // replace existing tags with html
                const body = this.esiParser.replacePathsWithHtml(parsedBody.getBody(), fileResponses);

                // retrieve the new urls and replace with tags
                const subParsedBody = this.esiParser.getPaths(body);
                if (!subParsedBody.hasUrls()) {
                    return resolve(new ESIResponse(this.esiParser.parseConditionals(body), cacheTime));
                }

                // re-tests the body for esis and then returns the ESI response
                const subPromise = this.sendRequest(subParsedBody);
                subPromise.then(esiResponse => {
                    return resolve(esiResponse);
                }, reasons => {
                    // TODO: take apart this to track different reasons
                    return reject(reasons);
                });

            }, reasons => {
                reject(reasons);
            });
        });
    }

    getLowestCacheTime(fileResponses) {

        const cacheTimes = [];
        for (let fileResponse of fileResponses) {
            cacheTimes[cacheTimes.length] = fileResponse.getCacheTime();
        }

        return Math.min.apply(null, cacheTimes);
    }
}

module.exports = ESIRequest;
