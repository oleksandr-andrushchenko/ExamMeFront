export class QuestionChoice {
  title: string = ''
  correct: boolean = false
  explanation?: string = ''
}

export enum QuestionType {
  CHOICE = 'choice',
}

export enum QuestionDifficulty {
  EASY = 'easy',
  MODERATE = 'moderate',
  DIFFICULT = 'difficult',
  EXPERT = 'expert',
}

export default interface CreateQuestion {
  categoryId: string
  title: string
  type: QuestionType
  choices?: QuestionChoice[]
  difficulty: QuestionDifficulty
}