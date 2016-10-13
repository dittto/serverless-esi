'use strict';

class FileResponse {
    constructor(path, body, cacheTime) {
        this.path = path;
        this.body = body;
        this.cacheTime = cacheTime;
    }

    getPath() {
        return this.path;
    }

    setPath(path) {
        this.path = path;
    }

    getBody() {
        return this.body;
    }

    setBody(body) {
        this.body = body;
    }

    getCacheTime() {
        return this.cacheTime || null;
    }

    setCacheTime(cacheTime) {
        this.cacheTime = cacheTime;
    }
}

module.exports = FileResponse;
