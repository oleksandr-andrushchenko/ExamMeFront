interface QuestionChoice {
  title: string,
  correct: boolean,
  explanation?: string,
}

export default interface Question {
  id: string,
  category: string,
  type: 'type' | 'choice',
  difficulty: 'easy' | 'moderate' | 'difficult' | 'expert',
  title: 'string',
  choices?: QuestionChoice[],
  answers?: string[],
  explanation?: string,
  created: number,
  updated?: number,
}