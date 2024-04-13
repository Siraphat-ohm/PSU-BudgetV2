import NextAuth from "next-auth/next";
import { User } from "./schemas/user.schema";

declare module "next-auth" {
    type Session = { 
        user: User
    }
}