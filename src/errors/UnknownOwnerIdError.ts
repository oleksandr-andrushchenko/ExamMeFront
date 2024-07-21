export default class UnknownOwnerIdError extends Error {
  public object

  constructor(object) {
    super()
    this.object = object
  }
}