class ReverseGeoWrapper {
  constructor(googleResponse) {
    // do validation
    
    this.addressResults = [...googleResponse.results]
  }

  getTopAddress(formatted=false) {
    if (formatted)
      return this.addressResults.length >= 1 ? this.addressResults[0].formatted_address : null;
    else
    return this.addressResults.length >= 1 ? this.addressResults[0] : null;
  }

  getAllAddresses() {
    return [...this.addressResults];
  }

  
}

module.exports = ReverseGeoWrapper;