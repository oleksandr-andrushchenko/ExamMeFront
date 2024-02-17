import apiClient from "./apiClient";
import { AxiosResponse } from "axios";
import Category from "../schema/Category";

const getCategories = async (): Promise<Category[]> => {
  const response: AxiosResponse = await apiClient.get('/categories');

  return response.data;
};

export default getCategories;