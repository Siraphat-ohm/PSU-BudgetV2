import { Response  } from "express";

export class PsuResponse {
    message: string;
    data: any;
    status: number;

    constructor( message?: string, data?:any, status = 200 ) {
        this.message = message ?? "ok";
        this.data = data ?? null;
        this.status = status;
    }
}

export const handlePsuResponse = ( psuResponse: PsuResponse, res: Response ): void => {

    const { message, data, status } = psuResponse;
    
    res.status( status );
    res.statusMessage = message;

    if ( [ 301, 302 ].includes( status ) ) {
        return res.redirect(data);
    }
    res.json( { message, data });

}