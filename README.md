### MapWrap :pushpin:
---
MapWrap is a simple wrapper around the Google Maps API for Geocoding, Directions, and Places. It provides simple methods to access data members in the API response with error checking.

MapWrap also implements a simple LRU cache to speed up requests and decrease the amount of unnecessary calls to the server. It is fully compliant with Google's restriction of not caching data for over 30 days.