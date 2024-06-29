import { gql } from '@apollo/client'

export default function examPageCurrentExamQuestionQuery(examId: string): any {
  return {
    query: gql`
        query ExamPageCurrentExamQuestion($examId: ID!) {
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
                    choices {
                        title
                    }
                }
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