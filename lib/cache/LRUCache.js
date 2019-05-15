const LRU = require("lru-cache");

class LRUCache {

  /**
   * @constructor
   * @param {Number} [max] - Maxmimum amount of items that can be held in the cache at once. 10 by default.
   * @param {Number} [maxAge] - Milliseconds for the maximum allowed age of an item. 300000 ms by default.
   */
  constructor(max=10, maxAge=300000) {
    const options = { 
      max, 
      length: function (n, key) { return 1 },
      dispose: function (key, n) {}, 
      maxAge
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