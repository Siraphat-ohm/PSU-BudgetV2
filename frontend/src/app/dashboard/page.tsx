'use client'
import { signOut, useSession } from "next-auth/react";
import * as React from "react";

export default function Home() {
    const { data: session, status } = useSession();
    return (
        status === "authenticated" &&
        session.user && (
        <div className="flex h-screen items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow-md">
        <p>
            Welcome, <b>{session.user.firstname} &nbsp; {session.user.lastname} !</b>
        </p>
        <p>Email: {session.user.username}</p>
        <p>Role: {session.user.role}</p>
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full bg-blue-500 text-white py-2 rounded"
        >
            Logout
        </button>
        </div>
        </div>
        )
    );
}
