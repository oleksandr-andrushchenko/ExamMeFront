export default class PaginatedMeta {
  public prevCursor?: string
  public prevUrl?: string
  public nextCursor?: string
  public nextUrl?: string
  public cursor: string = 'id'
  public size: number = 10
  public order: 'asc' | 'desc' = 'desc'
}