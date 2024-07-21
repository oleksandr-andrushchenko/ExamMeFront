import checkKnownOwnerId from '../checkKnownOwnerId'
import Category from '../../schema/category/Category'

/**
 * @param {Category} category
 * @returns {boolean}
 * @throws {UnknownOwnerIdError}
 */
export default function isCategoryApproved(category: Category): boolean {
  checkKnownOwnerId(category)

  return !category.ownerId
}