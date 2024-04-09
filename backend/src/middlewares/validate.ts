import { Request } from "express";
import { ZodError, z } from "zod";
import PsuError from "../utils/error";
import _ from "lodash";
import Logger from "../utils/logger";

const validateRequest = async (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>, req: Request): Promise<any> => {
  try {
    let data;
    if (!_.isEmpty(req.body)) {
      data = req.body;
    } else if (!_.isEmpty(req.params)) {
      console.log( req.params );
      data = req.params;
    } else if (!_.isEmpty(req.query)) {
      data = req.query;
    } else {
      throw new PsuError(400, 'Request data not found');
    }

    if (Array.isArray(data)) {
      data.map(item => {
        const validationResult = schema.parse(item);
        return validationResult;
      });
      
    } else {
      schema.parse(data);
    }

    return data;
  } catch (error) {
    Logger.error(error.message);
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((issue) => ({
        path: issue.path[0],
        message: issue.message,
      }));
      throw new PsuError(400, `Validation failed: ${formattedErrors[0]?.message}`);
    } else {
      throw new PsuError(500, "Internal server error during validation");
    }
  }
};

export default validateRequest;
