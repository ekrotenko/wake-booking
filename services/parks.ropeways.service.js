class ParksRopewaysService {
  constructor(parksService) {
  }

  async createRopewayInPark(park, ropewayData) {
    return park.createRopeway(ropewayData);
  }

  async getParkRopeways(park) {
    return park.getRopeways();
  }
}

module.exports = new ParksRopewaysService();
