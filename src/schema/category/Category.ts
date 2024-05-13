export default interface Category {
  id?: string
  name?: string
  questionCount?: number
  requiredScore?: number
  voters?: number
  rating?: number
  ownerId?: string
  createdAt?: number
  updatedAt?: number
}