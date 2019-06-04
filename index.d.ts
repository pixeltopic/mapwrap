declare namespace mapwrap {
  
  class MapWrapClass {
    private _logCache: boolean;

    public geocode(address: string): Promise<GeoWrapperClass>

    public reverseGeocode(lat: number, lng: number): Promise<ReverseGeoWrapperClass>

    public directions(params: directionsParams): Promise<DirectionsWrapperClass>

    public nearbySearchPlaces(params: nearbySearchPlacesParams): Promise<PlaceSearchWrapperClass>

    public additionalPlaces(nextPageToken: string): Promise<PlaceSearchWrapperClass>

    public placeDetails(placeId: string): Promise<Object>

  } 

  class GeoWrapperClass {
    public getTopAddress(formatted?: boolean): string|object

    public getAllAddresses(): object[]
  }

  class ReverseGeoWrapperClass {
    public getTopAddress(formatted?: boolean): string|object

    public getAllAddresses(): object[]
  }

  class DirectionsWrapperClass {
    public getStatus(): string
    public getErrorMessage(): string
    public getStartAddress(routeNum?: number): string
    public getEndAddress(routeNum?: number): string
    public getRoute(routeNum?: number): object
    public getRouteSteps(routeNum?: number): object[]
    public getRoutes(): object[]
  }

  class PlaceSearchWrapperClass {
    public getStatus(): string
    public getErrorMessage(): string
    public getNextPageToken(): string
    public getResults(): object[]
  }

  interface MapWrapConfig {
    DEFAULT_API_KEY: string,
    useRestrictedKeys?: {
      GEOCODING_API_KEY?: string,
      DIRECTIONS_API_KEY?: string,
      PLACES_API_KEY?: string
    },

    logCache?: boolean,
    logger?: Function,

    cacheMaxItemAges?: {
      reverseGeoCache?: number,
      geoCache?: number,
      directionsCache?: number,
      nearbySearchCache?: number,
      placeDetailsCache?: number
    }, 
    cacheMaxSizes?: {
      reverseGeoCache?: number,
      geoCache?: number,
      directionsCache?: number,
      nearbySearchCache?: number,
      placeDetailsCache?: number
    }
  }

  interface directionsParams {
    origin: string,
    destination: string,
    mode?: string,
    units?: string,
    altRoutes?: boolean,
    avoidFerries?: boolean,
    avoidHighways?: boolean,
    avoidIndoor?: boolean,
    avoidTolls?: boolean
  }

  interface nearbySearchPlacesParams {
    location: {
      lat: number,
      lng: number
    },
    radius: number,
    keyword?: string, 
    type?: string,
    minprice?: number,
    maxprice?: number
  }

}

declare function MapWrapInit(config: mapwrap.MapWrapConfig): mapwrap.MapWrapClass;

export = MapWrapInit;

