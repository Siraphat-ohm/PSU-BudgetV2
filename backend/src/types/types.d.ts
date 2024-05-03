type ExpressRequest = import("express").Request;


declare namespace PsuTypes {
    type UserPayload = {
        id: number;
        username: string;
        role : string;
        firstName: string | null;
        lastName: string | null;
    }

    type DecodedToken = {
        uid: string;
    } & UserPayload;

    type Context = {
        decodedToken: DecodedToken;
        fiscalYearId: number;
    }

    type Request = {
        ctx: Readonly<Context>
    } & ExpressRequest ;

}