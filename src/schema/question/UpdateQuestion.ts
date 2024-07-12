import { QuestionChoice, QuestionDifficulty, QuestionType } from './CreateQuestion'

export default interface UpdateQuestion {
  categoryId?: string
  title?: string
  type: QuestionType
  choices?: QuestionChoice[]
  difficulty?: QuestionDifficulty
}