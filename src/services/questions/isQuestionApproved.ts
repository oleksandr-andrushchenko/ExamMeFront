import Question from '../../schema/question/Question'
import checkKnownOwnerId from '../checkKnownOwnerId'

/**
 * @param {Question} question
 * @returns {boolean}
 * @throws {UnknownOwnerIdError}
 */
export default function isQuestionApproved(question: Question): boolean {
  checkKnownOwnerId(question)

  return !question.ownerId
}