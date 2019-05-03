declare namespace mapwrap {
  // export function MapWrapInit (config: MapWrapConfig): MapWrapClass
  // export function MapWrapInit (config: MapWrapConfig): (config: MapWrapConfig) => MapWrapClass
  // export function MapWrapInit (config: MapWrapConfig): MapWrapClass

  class MapWrapClass {
    private _logCache: boolean;

    public geocode(address: string): Promise<GeoWrapperClass>

    public reverseGeocode(lat: number, lng: number): Promise<ReverseGeoWrapperClass>

  } 

  class GeoWrapperClass {
    public getTopAddress(formatted?: boolean): string|object|null

    public getAllAddresses(): object[]|null
  }

  class ReverseGeoWrapperClass {
    public getTopAddress(formatted?: boolean): string|object|null

    public getAllAddresses(): object[]|null
  }

  interface MapWrapConfig {
    DEFAULT_API_KEY: string,
    useRestrictedKeys?: {
      GEOCODING_API_KEY?: string,
      DIRECTIONS_API_KEY?: string,
      PLACES_API_KEY?: string
    },
    logCache?: boolean,
    reverseGeoCacheSize?: number,
    geoCacheSize?: number,
    directionsCacheSize?: number,
    nearbySearchCacheSize?: number,
    placeDetailsCacheSize?: number
  }

}

declare function MapWrapInit(config: mapwrap.MapWrapConfig): mapwrap.MapWrapClass;

export = MapWrapInit;

