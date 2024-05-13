import { QuestionAnswer, QuestionChoice, QuestionDifficulty, QuestionType } from './QuestionTransfer'
import Category from '../category/Category'

export default interface Question {
  id?: string
  categoryId?: string
  category?: Category
  title?: string
  type?: QuestionType
  answers?: QuestionAnswer[]
  choices?: QuestionChoice[]
  difficulty?: QuestionDifficulty
  createdAt?: number
  updatedAt?: number
}