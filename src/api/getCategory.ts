import apiClient from "../api/apiClient";
import Category from "../schema/Category";

export default async (categoryId: string): Promise<Category> => (await apiClient.get(`/categories/${categoryId}`)).data;