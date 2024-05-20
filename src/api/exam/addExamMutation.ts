import { gql } from '@apollo/client'
import ExamTransfer from '../../schema/exam/ExamTransfer'

export default function addExamMutation(exam: ExamTransfer): any {
  return {
    mutation: gql`
        mutation AddExam(
            $exam: CreateExamSchema!
        ) {
            addExam(
                exam: $exam
            ) {
                id
                categoryId
            }
        }
    `,
    variables: {
      exam,
    },
  }
}