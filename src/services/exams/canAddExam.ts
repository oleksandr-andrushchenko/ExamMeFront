import Category from '../../schema/category/Category'

/**
 * @param {Category} category
 * @returns {boolean}
 */
export default function canAddExam(category: Category): boolean {
  if (!category.isApproved) {
    return false
  }

  if ((category.approvedQuestionCount ?? 0) === 0) {
    return false
  }

  return true
}