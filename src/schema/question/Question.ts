import { QuestionAnswer, QuestionChoice, QuestionDifficulty, QuestionType } from './QuestionTransfer'
import Category from '../category/Category'
import Rating from '../Rating'

export default interface Question {
  id?: string
  categoryId?: string
  category?: Category
  title?: string
  type?: QuestionType
  answers?: QuestionAnswer[]
  choices?: QuestionChoice[]
  difficulty?: QuestionDifficulty
  multiChoice?: boolean
  rating?: Rating
  ownerId?: string
  createdAt?: number
  updatedAt?: number
}