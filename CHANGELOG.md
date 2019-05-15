## Version 2.0.0
- Config object schema overhauled to provide more flexibility. **New config schema is partially incompatible with 1.x.x versions.**
  - cache size settings have all been renamed and can now be configured via the `cacheMaxSizes` key in the config, with its value being an object with the following optional settings:
    - `reverseGeoCacheSize` renamed to `reverseGeoCache`
    - `geoCacheSize` renamed to `geoCache`
    - `directionsCacheSize` renamed to `directionsCache`
    - `nearbySearchCacheSize` renamed to `nearbySearchCache`
    - `placeDetailsCacheSize` renamed to `placeDetailsCache`
  - Cache max age configuration implemented. Use the `cacheMaxItemAges` key in the config. Its value is an object with the following optional settings:
    - `reverseGeoCache`
    - `geoCache`
    - `directionsCache`
    - `nearbySearchCache`
    - `placeDetailsCache`
    - Each accepts a value in milliseconds. Defaults to 300000 ms (5 minutes). Accepts a minimum of 1 minute and a max of 30 days. When this age is exceeded by an item in its respective LRU cache, the item will be dropped on the next access attempt.

  - to fix the compatibility issues, if you were using any of the renamed config properties you must rename them and place then within `cacheMaxSizes`. Otherwise, no change is needed.

- added optional `logger` config setting for custom logging support. Defaults to `console.log`. Accepts a function.
- Fixed some incorrect docstrings
- updated typings to reflect new changes

## Version 1.1.0
- Fixed error throwing accessing invalid property
- Added typing support
- Improved usage documentation coverage.

## Version 1.0.x
- Only minor fixes to documentation.

## Version 1.0.0
- Initial Release