import Rating from '../rating/Rating'

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
  examId?: string
  createdAt?: number
  updatedAt?: number
}