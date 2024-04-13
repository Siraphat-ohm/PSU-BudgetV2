import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = { 
   providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            username: { label: "Username", type:"text" },
            password: { label: "Password", type:"password" },
        },
        async authorize(credentials){
            try {
                const userCredentials = { username: credentials?.username, password: credentials?.password }
                const response = await fetch( 
                                `${process.env.BASE_API_URL!}/users/signIn`, {
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                method: "POST",
                                body: JSON.stringify(userCredentials)
                });
                if ( response.status === 200 ){
                    const user = ( await response.json() ).data;
                    return user;
                }
                throw new Error( (await response.json()).message )
            } catch (error: any) {
                throw new Error( error.message )
            }
        },
    }),
   ] ,
   secret: process.env.NEXTAUTH_SECRET,
   callbacks: {
    async jwt( { token, user, account } ){
        return { ...token, ...user }
    },
    async session( { session, token, user } ){ 
        session.user = token as any
        return session;
    }
   },
   pages: {
    signIn: "/signIn",
   }
   ,
   session: {
        maxAge: 29 * 24 * 60 * 60 
   }
}