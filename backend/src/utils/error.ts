import { isDevEnvironment } from "./misc";

class PsuError extends Error {
    status: number;

    constructor( status: number, message?: string, stack?: string ) {
        super();
        this.status = status ?? 500;

        if ( isDevEnvironment() ){
            this.message =
                stack ?? ""
                    ? String( message ) + "\nStack: " + String( stack )
                    : String( message )
        } else {
            if (( this.stack ?? "" ) && this.status  >= 500 ){
                this.stack = this.message + "\n" + this.stack;
                this.message = "Internal Server Error"
            } else {
                this.message = String( message );
            }
        }

        console.log(this.message, this.name, this.status, 'from: util error.ts');
        
    }
}

export default PsuError;