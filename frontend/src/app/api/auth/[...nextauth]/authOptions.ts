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
                const response = await fetch( 
                                `${process.env.BASE_API_URL!}/users/signIn`, {
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                method: "POST",
                                body: JSON.stringify(credentials)
                            });
                const user = ( await response.json() ).data;
                return user;
            } catch (error: any) {
                throw new Error( error.response.data.message )
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
        if ( session.user ) session.user.role = token.role as any;
        return session;
    }
   },
   pages: {
    signIn: "/auth/signIn",
   }
   ,
   session: {
        maxAge: 29 * 24 * 60 * 60 
   }

}