import apiClient from "../api/apiClient";
import { AxiosResponse } from "axios";

export default async function categoriesLoader() {
  const response: AxiosResponse = await apiClient.get('/categories');

  return response.data;
}