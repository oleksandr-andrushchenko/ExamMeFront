import apiClient from "../api/apiClient";
import Me from "../schema/Me";
import { AxiosResponse } from "axios";

export const getMe = async (): Promise<Me> => {
  const response: AxiosResponse = await apiClient.get('/me');

  return response.data;
};