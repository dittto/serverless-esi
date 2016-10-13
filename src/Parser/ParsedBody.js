'use strict';

class ParsedBody {
    constructor(body, urls) {
        this.setBody(body);
        this.setUrls(urls);
    }

    getBody() {
        return this.body;
    }

    setBody(body) {
        this.body = body;
    }

    getUrls() {
        return this.urls;
    }

    setUrls(urls) {
        this.urls = Array.isArray(urls) ? urls : [urls];
    }

    hasUrls() {
        return this.urls && this.urls.length > 0;
    }
}

module.exports = ParsedBody;
