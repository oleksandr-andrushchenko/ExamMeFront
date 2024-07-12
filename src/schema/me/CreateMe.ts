import Credentials from '../auth/Credentials'

export default interface CreateMe extends Credentials {
  name?: string
}