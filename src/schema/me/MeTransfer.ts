import CredentialsTransfer from '../auth/CredentialsTransfer.ts'

export default interface MeTransfer extends CredentialsTransfer {
  name?: string
}