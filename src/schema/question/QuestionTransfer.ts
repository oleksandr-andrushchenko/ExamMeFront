export class QuestionChoice {
  title: string = ''
  correct: boolean = false
  explanation?: string = ''
}

export class QuestionAnswer {
  variants: string = ''
  correct: boolean = false
  explanation?: string = ''
}

export enum QuestionType {
  // todo: rename to ANSWER
  TYPE = 'type',
  CHOICE = 'choice',
}

export enum QuestionDifficulty {
  EASY = 'easy',
  MODERATE = 'moderate',
  DIFFICULT = 'difficult',
  EXPERT = 'expert',
}

export default interface QuestionTransfer {
  categoryId: string
  title: string
  type: QuestionType
  answers?: QuestionAnswer[]
  choices?: QuestionChoice[]
  difficulty: QuestionDifficulty
}