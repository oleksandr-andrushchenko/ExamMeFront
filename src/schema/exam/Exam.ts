import Category from '../category/Category'

export default interface Exam {
  id?: string
  categoryId?: string
  category?: Category
  questionNumber?: number
  questionCount?: number
  answeredQuestionCount?: number
  completedAt?: number
  ownerId?: string
  createdAt?: number
  updatedAt?: number
}