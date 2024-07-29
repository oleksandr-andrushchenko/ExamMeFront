import Rating from '../Rating'

export default interface Category {
  id?: string
  name?: string
  questionCount?: number
  approvedQuestionCount?: number
  requiredScore?: number
  voters?: number
  rating?: Rating
  isApproved?: boolean
  isOwner?: boolean
  isCreator?: boolean
  createdAt?: number
  updatedAt?: number
}