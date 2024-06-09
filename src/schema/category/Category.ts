import Rating from '../Rating'

export default interface Category {
  id?: string
  name?: string
  questionCount?: number
  requiredScore?: number
  voters?: number
  rating?: Rating
  ownerId?: string
  createdAt?: number
  updatedAt?: number
}