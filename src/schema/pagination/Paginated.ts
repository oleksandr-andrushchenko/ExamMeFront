import PaginatedMeta from './PaginatedMeta'

export default class Paginated<Entity> {
  public data: Entity[]
  public meta: PaginatedMeta
}