import Category from '../category/Category'

export default interface Exam {
  id?: string
  categoryId?: string
  category?: Category
  questionNumber?: number
  questionsCount?: number
  answeredCount?: number
  completedAt?: number
  ownerId?: string
  createdAt?: number
  updatedAt?: number
}