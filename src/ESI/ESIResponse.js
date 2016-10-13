'use strict';

class ESIResponse {
    constructor(body, cacheTime, statusCode) {
        this.body = body;
        this.cacheTime = cacheTime;
        this.statusCode = statusCode;
    }

    getBody() {
        return this.body || '';
    }

    getCacheTime() {
        return this.cacheTime || null;
    }

    getStatusCode() {
        return this.statusCode || 200;
    }
}

module.exports = ESIResponse;
