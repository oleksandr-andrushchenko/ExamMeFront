import loaderClient from "./loaderClient";
import { AxiosResponse } from "axios";

export default async function categoriesLoader() {
  const response: AxiosResponse = await loaderClient.get('/categories');

  return response.data;
}