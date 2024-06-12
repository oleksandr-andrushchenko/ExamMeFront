import { QuestionChoice, QuestionDifficulty, QuestionType } from './QuestionTransfer'

export default interface QuestionUpdateTransfer {
  categoryId?: string
  title?: string
  type: QuestionType
  choices?: QuestionChoice[]
  difficulty?: QuestionDifficulty
}