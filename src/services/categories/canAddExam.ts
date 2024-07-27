import Category from '../../schema/category/Category'
import isCategoryApproved from './isCategoryApproved'

/**
 * @param {Category} category
 * @returns {boolean}
 */
export default function canAddExam(category: Category): boolean {
  return isCategoryApproved(category) && (category.approvedQuestionCount ?? 0) > 0
}