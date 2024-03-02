type ExpressRequest = import("express").Request;

declare namespace PsuTypes {
    type DecodedToken = {
        uid: string;
    }

    type Context = {
        decodedToken: DecodedToken;
    }

    type Request = {
        ctx: Readonly<Context>
    } & ExpressRequest;
}