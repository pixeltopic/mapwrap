const LRU = require("lru-cache");

class LRUCache {

  constructor(max=10) {
    const options = { 
      max, 
      length: function (n, key) { return 1 },
      dispose: function (key, n) {}, 
      maxAge: 300000
    }
    this.cache = new LRU(options);
  }

  set(key, value) {
    this.cache.set(key, value);
  }

  get(key) {
    return this.cache.get(key);
  }

  flush() {
    this.cache.reset();
  }
}

module.exports = LRUCache;