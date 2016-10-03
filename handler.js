'use strict';

class ESIRequest {
    constructor(s3, defaultParams) {
        this.s3 = s3;
        this.defaultParams = defaultParams;
    }

    sendRequest(paths) {
        let promises;
        for (let path of paths) {
            promises[promises.length] = new Promise((resolve, reject) => {
                this.promiseDeclaration(path, resolve, reject);
            });
        }

        return new Promise((resolve, reject) => {
            Promise.all(promises).then(values => {
                console.log("params");
                console.log(values);

                // read body and retrieve esi urls

                // next two steps in a sub function

                    // send request on all new esi urls

                    // on a valid response, replace urls with body code

                // how to tag esi code correctly?

                // resolve(other_vals);
            }, reason => {
                console.log("reason");
                console.log(reason);
                // reject(reasons);
            });
        });
    }

    promiseDeclaration(path, resolve, reject) {
        let params = Object.assign(this.defaultParams, {Key: path});

        // an s3 getObject request for each path
        this.s3.getObject(
            params, (err, data) => {
                console.log("params");
                // on error, reject

                // otherwise, resolve with path and body
            }
        );
    }
}

module.exports.esi = (event, context, cb) => {

    // get the path
    let path = '';
    if (event && event.path && event.path.path) {
        path = event.path.path;
    }
    if (!path) {
        // the [] value is picked up in the API gateway
        cb(new Error('[404] Not found'));
    }

    let AWS = require('aws-sdk');
    let s3 = new AWS.S3();
    let params = {
        Bucket: 'test-dev-buckets-must-be-globally-unique',
        Key: path
    };

    // send esi request
    let esiRequest = new ESIRequest(s3, params);
    let promise = esiRequest.sendRequest(['test.html']);
    promise.then(values => {
        console.log("values");
    }, reason => {
        console.log("reason");
    });

    /*
    s3.getObject(
        params, (err, data) => {
            // parse received code for esi urls

            // send esi requests in batch

            // return html



            if (err) {
                console.log("GET ERROR");
                cb(new Error('[404] Missing file at ' + path + ' ' + err));
            } else {
                console.log("GET PASSED");
                let body = data.Body.toString('utf-8');
                cb(null, body);
            }



        }
    );*/
    cb(null, "done");

    // register of current getObjects when all success, return data

    // need to pass parent. If parent is null, return body

    // get data. If error, trigger callback

    // do recursively

    // parse all esi stuff

    // look at https://github.com/silvermine/serverless-plugin-multiple-responses/blob/master/src/index.js for how to change 40x into html
};
