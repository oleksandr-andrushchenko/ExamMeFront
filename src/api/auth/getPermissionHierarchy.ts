import client from '../client'
import PermissionHierarchy from '../../types/PermissionHierarchy'

export default async (): Promise<PermissionHierarchy> => (await client.get('/permissions/hierarchy')).data