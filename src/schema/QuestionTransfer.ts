export interface QuestionChoice {
  title: string,
  correct: boolean,
  explanation?: string,
}

export interface QuestionAnswer {
  variants: string[],
  correct: boolean,
  explanation?: string,
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
  category: string,
  title: string,
  type: QuestionType,
  answers?: QuestionAnswer[],
  choices?: QuestionChoice[],
  difficulty: QuestionDifficulty,
}