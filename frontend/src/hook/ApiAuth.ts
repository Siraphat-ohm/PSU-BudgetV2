import { getSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const ApiAuth = () => {
    const instance = axios.create( {
        baseURL: BASE_URL,
        headers: { "Content-Type": "application/json" },
    });
  
    instance.interceptors.request.use(async (request) => {
      const session = typeof window !== "undefined" ? await getSession() : await getServerSession(authOptions);
      if (session) {
        request.headers["Authorization"] = `Bearer ${session.user.accessToken}`;
      }
      return request;
    });
  
    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        return Promise.reject<AxiosError>(error);
      }
    );
  
    return instance;
};



export default ApiAuth();