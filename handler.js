'use strict';

const ESIRequest = require('./src/ESIRequest.js');

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

    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();
    const params = {
        Bucket: 'test-dev-buckets-must-be-globally-unique',
        Key: 'path-to-retrieve-from-s3'
    };

    // send esi request
    const esiRequest = new ESIRequest(s3, params);
    const promise = esiRequest.sendRequest('', [path]);
    promise.then(html => {
        cb(null, html);
    }, reason => {
        console.log(reason);
        cb(null, "broked");
    });

    // plug into path

    // test with multiple esis

    // parse all esi stuff

    // look at https://github.com/silvermine/serverless-plugin-multiple-responses/blob/master/src/index.js for how to change 40x into html

    // move s3.getobject into another object
};
