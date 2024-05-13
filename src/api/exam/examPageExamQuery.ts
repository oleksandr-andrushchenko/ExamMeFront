import { gql } from '@apollo/client'

export default function examPageExamQuery(examId: string): any {
  return {
    query: gql`
        query ExamPageExam($examId: ID!) {
            exam(examId: $examId) {
                id
                questionNumber
                completedAt
                ownerId
                questionsCount
                answeredCount
                category {id name}
            }
        }
    `,
    variables: {
      examId,
    },
  }
}