import UnknownOwnerIdError from '../errors/UnknownOwnerIdError'

export default function checkKnownOwnerId(object): void {
  if ('ownerId' in object) {
    return
  }

  throw new UnknownOwnerIdError(object)
}