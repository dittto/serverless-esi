'use strict';

const ParsedBody = require('./ParsedBody.js');

module.exports = class {
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

    replacePathsWithHtml(body, values) {
        // handle a missing body
        if (!body && values[0]) {
            return values[0].body;
        }

        // replace tags with values
        for (let value of values) {
            body = body.replace('<%--' + value.path + '--%>', value.body);
        }

        return body;
    }

    parseConditionals(body) {
        return body;
    }
};
