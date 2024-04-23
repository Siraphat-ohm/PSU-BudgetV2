import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Auth Fetch with default fetch
// How to use 
// import { fetchAuth } from "@/lib/fetch";
// const res = await fetchAuth("/api/user");
// How to post method
// const res = await fetchAuth("/api/user", { method: "POST", body: JSON.stringify({ name: "John" }) });
export const fetchAuth = async (input: RequestInfo, init?: RequestInit) => {
  const session = typeof window !== "undefined" ? await getSession() : await getServerSession(authOptions);
  const headers = new Headers(init?.headers);
  if (session) {
    headers.set("Authorization", `Bearer ${session.user.accessToken}`);
  }
  return await fetch( `${BASE_URL}${input}`, { ...init, headers });
};