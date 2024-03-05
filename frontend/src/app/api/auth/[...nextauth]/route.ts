import axios from "@/lib/axios";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({ 
   providers: [
    CredentialsProvider({
        name: "Credentials",
        credentials: {
            username: { label: "Username", type:"text" },
            password: { label: "Password", type:"password" },
        },
        async authorize(credentials){
            try {
                const res = await axios.post( "/users/signIn", credentials );
                return res.data.data;
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
        return session;
    }
   }


});

export { handler as GET, handler as POST };