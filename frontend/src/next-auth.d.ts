import NextAuth from "next-auth/next";
import { User } from "./_schema/user";

declare module "next-auth" {
    type Session = { 
        user: User
    }
}