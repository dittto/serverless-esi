'use strict';

const ESIRequest = require('./src/ESIRequest.js');
const FileHandler = require('./src/FileHandler/S3Handler.js');
const AWS = require('aws-sdk');

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

    // init aws settings
    const s3 = new AWS.S3();
    const params = {
        Bucket: 'test-dev-buckets-must-be-globally-unique',
        Key: 'path-to-retrieve-from-s3'
    };

    // send esi request
    const fileHandler = new FileHandler(s3, params);
    const esiRequest = new ESIRequest(fileHandler);
    const promise = esiRequest.sendRequest('', [path]);
    promise.then(html => {
        cb(null, html);
    }, reason => {
        console.log(reason);
        cb(null, "broked");
    });

};
