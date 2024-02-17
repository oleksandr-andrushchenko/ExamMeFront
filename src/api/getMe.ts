import apiClient from "../api/apiClient";
import Me from "../schema/Me";

export const getMe = async (): Promise<Me> => (await apiClient.get('/me')).data;