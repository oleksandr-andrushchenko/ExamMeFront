import { gql } from '@apollo/client'
import ExamTransfer from '../../schema/exam/ExamTransfer'

export default function createExamMutation(exam: ExamTransfer): any {
  return {
    mutation: gql`
        mutation CreateExam($exam: CreateExamSchema!) {
            createExam(exam: $exam) {
                id
                ownerId
            }
        }
    `,
    variables: {
      exam,
    },
  }
}