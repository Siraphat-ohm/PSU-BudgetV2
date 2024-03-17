import { getSession } from "next-auth/react";
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ApiAuth = () => {
    const instance = axios.create( {
        baseURL: BASE_URL,
        headers: { "Content-Type": "application/json" }
    });
  
    instance.interceptors.request.use(async (request) => {
      const session = await getSession();
      if (session) {
        request.headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      }
      return request;
    });
  
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        return Promise.reject(error);
      }
    );
  
    return instance;
};

export default ApiAuth();