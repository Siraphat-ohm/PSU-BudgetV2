import { Request } from "express";
import { ZodError, z } from "zod";
import PsuError from "../utils/error";
import _ from "lodash";
import Logger from "../utils/logger";

const validateRequest = async (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>, req: Request): Promise<any> => {
  try {

    if ( !_.isEmpty( req.body ) ){
      await schema.parseAsync( req.body );
      return req.body;
    } else if ( !_.isEmpty( req.params ) ){
      await schema.parseAsync( req.params );
      return req.params;
    } else if ( !_.isEmpty( req.query ) ){
      await schema.parseAsync( req.query );
      return req.query;
    }

    throw new PsuError( 400, 'Request not found' );
  } catch (error) {
    Logger.error( error.message );
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((issue) => ({
        path: issue.path[0],
        message: issue.message,
      }));
      throw new PsuError(400, `Validation failed ${ formattedErrors[0]?.message }`);
    } else {
      throw new PsuError(500, "Internal server error during validation");
    }
  }
};

export default validateRequest;