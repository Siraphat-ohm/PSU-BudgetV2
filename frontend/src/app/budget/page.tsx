"use client"
import { Button } from "@nextui-org/button";
import { signOut, useSession } from "next-auth/react";


export default function Budget() {

    const { data, status } = useSession();

    if ( status === "loading" ) return <div>loading</div>

    return (
        <div>
            <Button onClick={async() => await signOut()}>Logout</Button>
            <div>{JSON.stringify( data ) }</div>
        </div>
    )
}