import { gql } from '@apollo/client'

export default function clearExamQuestionAnswerMutation(
  examId: string,
  question: number,
): any {
  return {
    mutation: gql`
        mutation ClearExamQuestionAnswer(
            $examId: ID!,
            $question: Int!
        ) {
            clearExamQuestionAnswer(
                examId: $examId,
                question: $question
            ) {
                exam {
                    id
                    questionNumber
                    questionCount
                    answeredQuestionCount
                    categoryId
                    category {
                        name
                    }
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
      question,
    },
    errorPolicy: 'all',
    fetchPolicy: 'network-only',
  }
}