import { QuestionChoice, QuestionDifficulty, QuestionType } from './CreateQuestion'
import Category from '../category/Category'
import Rating from '../Rating'

export default interface Question {
  id?: string
  categoryId?: string
  category?: Category
  title?: string
  type?: QuestionType
  choices?: QuestionChoice[]
  difficulty?: QuestionDifficulty
  multiChoice?: boolean
  rating?: Rating
  ownerId?: string
  createdAt?: number
  updatedAt?: number

  // todo: add tags
}