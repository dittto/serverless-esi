'use strict';

const ParsedBody = require('./ParsedBody.js');

class ESIParser {
    getPaths(body) {
        // gets the next set of ESIs
        const includeRegex = /<esi:include[^>]*src="([^"]*)"[^>]*>/gi;
        const urls = [];
        let matches;
        while ((matches = includeRegex.exec(body)) != null) {
            body = body.replace(matches[0], '<%--' + matches[1] + '--%>');
            urls[urls.length] = matches[1];
        }

        return new ParsedBody(body, urls);
    }

    replacePathsWithHtml(body, fileResponses) {
        // handle a missing body
        if (!body && fileResponses[0]) {
            return fileResponses[0].getBody();
        }

        // replace tags with values
        for (let fileResponse of fileResponses) {
            body = body.replace('<%--' + fileResponse.getPath() + '--%>', fileResponse.getBody());
        }

        return body;
    }

    parseConditionals(body) {
        return body;
    }
}

module.exports = ESIParser;
