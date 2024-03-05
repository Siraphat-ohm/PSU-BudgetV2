import NextAuth from "next-auth/next";

declare module "next-auth" {
    interface Session {
        user : {
            id : number;
            username: string;
            firstname: string;
            lastname: string;
            accessToken: string;
            role: string;
        }
    }
}