import { z } from "zod";

const idSchema = z.string({
  required_error: "Id is required.",
  invalid_type_error: "Id must be a string.",
});

const dateSchema = z.string({
  required_error: "Date is required.",
  invalid_type_error: "Date must be a string.",
});

const DisbursementBodySchema = z.object({
  id: z.number().optional(),
  codeId: z.number(),
  withdrawalAmount: z.number(),
  psuCode: z.string(),
  date: dateSchema,
  note: z.string().optional(),
  userId: z.number().optional(),
});

const DisbursementByIdSchema = z.object({
  id: idSchema,
});

const DisbursementSchema = z.object({
  body: DisbursementBodySchema,
});

const DisbursementCreateManySchema = z.object({
  body: z.array( DisbursementBodySchema ),
});

const pageLimitSchema = z.string().optional().default("10");
const dateOptionalSchema = z.string().optional();

const DisbursementsFetchSchema = z.object({
  query: z.object({
    page: pageLimitSchema,
    limit: pageLimitSchema,
    startDate: dateOptionalSchema,
    endDate: dateOptionalSchema,
    psuCode: z.string().optional(),
  }),
});


const DisbursementEditSchema = z.object({
  body: DisbursementBodySchema,
  params: DisbursementByIdSchema,
});

const DisbursementFetchSchema = z.object({
  params: DisbursementByIdSchema,
});

const DisbursementRemoveSchema = z.object({
  params: DisbursementByIdSchema,
});

export {
  DisbursementSchema,
  DisbursementEditSchema,
  DisbursementFetchSchema,
  DisbursementsFetchSchema,
  DisbursementRemoveSchema,
  DisbursementCreateManySchema
};
