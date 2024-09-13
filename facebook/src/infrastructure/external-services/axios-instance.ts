import axios, { AxiosError, AxiosInstance } from "axios";
import { FacebookError } from "../../interface-adapters/services/IFacebookPageApi";

export function createAxios(config: { baseUrl: string }): AxiosInstance {
  const axiosInstance = axios.create({
    baseURL: config.baseUrl,
  });

  const errorInterceptor = (error: unknown) => {
    if (error instanceof AxiosError) {
      throw new FacebookError(error.message, error.response?.data);
    }
    throw error;
  };

  axiosInstance.interceptors.response.use(
    (response) => response,
    errorInterceptor,
  );

  return axiosInstance;
}
