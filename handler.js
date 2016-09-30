'use strict';

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

    s3.getObject(
        params, (err, data) => {
            if (err) {
                console.log("GET ERROR");
                cb(new Error('[404] Missing file at ' + path + ' ' + err));
            } else {
                console.log("GET PASSED");
                let body = data.Body.toString('utf-8');
                cb(null, body);
            }
        }
    );

    // register of current getObjects when all success, return data

    // need to pass parent. If parent is null, return body

    // get data. If error, trigger callback

    // do recursively

    // parse all esi stuff

    // look at https://github.com/silvermine/serverless-plugin-multiple-responses/blob/master/src/index.js for how to change 40x into html
};
