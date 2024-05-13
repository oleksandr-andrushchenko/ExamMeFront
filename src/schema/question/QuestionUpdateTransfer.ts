import { QuestionAnswer, QuestionChoice, QuestionDifficulty, QuestionType } from './QuestionTransfer'

export default interface QuestionUpdateTransfer {
  categoryId?: string
  title?: string
  type: QuestionType
  answers?: QuestionAnswer[]
  choices?: QuestionChoice[]
  difficulty?: QuestionDifficulty
}