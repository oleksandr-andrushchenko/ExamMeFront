import CredentialsTransfer from '../auth/CredentialsTransfer'

export default interface MeTransfer extends CredentialsTransfer {
  name?: string
}