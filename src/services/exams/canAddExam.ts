import Category from '../../schema/category/Category'
import isCategoryApproved from '../categories/isCategoryApproved'

/**
 * @param {Category} category
 * @returns {boolean}
 */
export default function canAddExam(category: Category): boolean {
  if (!isCategoryApproved(category)) {
    return false
  }

  if ((category.approvedQuestionCount ?? 0) === 0) {
    return false
  }

  return true
}