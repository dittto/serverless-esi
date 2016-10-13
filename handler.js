'use strict';

const AWS = require('aws-sdk');
const ESIRequest = require('./src/ESI/ESIRequest');
const FileHandler = require('./src/FileHandler/S3Handler');
const ESIParser = require('./src/Parser/ESIParser');
const ParsedBody = require('./src/Parser/ParsedBody');
const SharedVars = require('serverless-shared-vars').get();

module.exports.esi = (event, context) => {

    // get the path
    let path = '';
    if (event && event.pathParameters && event.pathParameters.path) {
        path = event.pathParameters.path;
    }
    if (!path) {
        context.succeed({
            statusCode: 404,
            headers: {
                "Cache-Control" : 0,
                "Content-Type": "text/html"
            },
            body: 'Path not found'
        });
    }

    // init aws settings
    const s3 = new AWS.S3();
    const params = {
        Bucket: SharedVars.s3Bucket,
        Key: '-'
    };

    // send esi request
    const fileHandler = new FileHandler(s3, params);
    const esiRequest = new ESIRequest(fileHandler, new ESIParser());
    const promise = esiRequest.sendRequest(new ParsedBody('', path));
    promise.then(esiResponse => {
        context.succeed({
            statusCode: 200,
            headers: {
                "Cache-Control" : esiResponse.getCacheTime(),
                "Content-Type": "text/html"
            },
            body: esiResponse.getBody()
        });
    }, reason => {
        console.log("Handler");
        console.log(reason);
        context.succeed({
            statusCode: 404,
            headers: {
                "Cache-Control" : 0,
                "Content-Type": "text/html"
            },
            body: 'bugger'
        });
    });
};
