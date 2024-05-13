import { gql } from '@apollo/client'

export default function examPageExamQuestionQuery(examId: string, question: number): any {
  return {
    query: gql`
        query ExamPageExamQuestion($examId: ID!, $question: Int!) {
            examQuestion(examId: $examId, question: $question) {number question difficulty type choices choice answer}
        }
    `,
    variables: {
      examId,
      question,
    },
  }
}