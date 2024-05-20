export default interface ExamQuestion {
  number?: number
  question?: string
  type?: string
  difficulty?: string
  choices?: string[]
  choice?: number
  answer?: string
}