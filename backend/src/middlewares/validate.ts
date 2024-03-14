import { Request } from "express";
import { ZodError, z } from "zod";
import PsuError from "../utils/error";

const validateRequest = async (schema: z.AnyZodObject | z.ZodOptional<z.AnyZodObject>, req: Request): Promise<any> => {
  try {
    await schema.parseAsync(req.body);
    return req.body;
  } catch (error) {
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