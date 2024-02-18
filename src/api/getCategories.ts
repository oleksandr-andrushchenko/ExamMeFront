import apiClient from "./apiClient";
import Category from "../schema/Category";

export default async (): Promise<Category[]> => (await apiClient.get('/categories')).data;