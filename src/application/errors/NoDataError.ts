export default class NoDataError extends Error {
  constructor() {
    super('Service relies on data to be present in order to work.');
  }
}
