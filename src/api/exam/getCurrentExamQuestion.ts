import { gql } from '@apollo/client'

export default function getCurrentExamQuestion(examId: string): any {
  return {
    query: gql`
        query GetCurrentExamQuestion($examId: ID!) {
            currentExamQuestion(examId: $examId) {
                exam {
                    id
                    questionNumber
                    questionCount
                    answeredQuestionCount
                    correctAnswerCount
                    categoryId
                    category {
                        name
                        requiredScore
                    }
                    completedAt
                    ownerId
                }
                question {
                    id
                    title
                    type
                }
                choices
                number
                choice
                answer
            }
        }
    `,
    variables: {
      examId,
    },
  }
}