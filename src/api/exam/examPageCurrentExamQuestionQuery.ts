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
                    categoryId
                    category {
                        name
                    }
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
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  }
}