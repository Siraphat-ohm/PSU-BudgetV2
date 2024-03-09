type ExpressRequest = import("express").Request;


declare namespace PsuTypes {
    type UserPayload = {
        id: number;
        username: string;
        role : string;
        firstname: string | null;
        lastname: string | null;
    }

    type DecodedToken = {
        uid: string;
    } & UserPayload;

    type Context = {
        decodedToken: DecodedToken;
    }

    type Request = {
        ctx: Readonly<Context>
    } & ExpressRequest;

}