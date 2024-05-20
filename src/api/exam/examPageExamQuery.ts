import { gql } from '@apollo/client'

export default function examPageExamQuery(examId: string): any {
  return {
    query: gql`
        query ExamPageExam($examId: ID!) {
            exam(examId: $examId) {
                id
                categoryId
                questionNumber
                ownerId
                questionCount
                answeredQuestionCount
                category {name}
            }
        }
    `,
    variables: {
      examId,
    },
  }
}