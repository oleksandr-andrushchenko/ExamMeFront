import Category from '../../schema/category/Category'

/**
 * @param {Category} category
 * @returns {boolean}
 */
export default function canAddExam(category: Category): boolean {
  return (category.approvedQuestionCount ?? 0) > 0
}