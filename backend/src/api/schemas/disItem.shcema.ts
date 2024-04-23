import { string, z } from "zod";

const DisbursementByIdSchema = z.object({
    id: string({
        required_error: "Id is required.",
        invalid_type_error: "Id must be string."
    })
});

export const DisbursementSchema = z.object({
    body: z.object({
        facultyId: z.number(),
        codeId: z.number(),
        amount: z.string(),
        psuCode: z.string(),
        date: z.string(),
        note: z.string().optional()
    })
});

export const DisbursementEditSchema = z.object({
    body: DisbursementSchema.shape.body,
    params: DisbursementByIdSchema
})

export const DisbursementFetchSchema = z.object({
    params: DisbursementByIdSchema
});

export const DisbursementsFetchSchema = z.object({
    query: z.object({
        page: z.string().optional().default("1"),
        limit: z.string().optional().default("10"),
        startDate: z.string().optional(),
        endDate: z.string().optional()
    })
});

export const DisbursementRemoveSchema = z.object({
    params: DisbursementByIdSchema
});

export const SummarySchema = z.object({
    query: z.object({
        mode: z.enum( [ 'O', 'N', 'D', 'B' ]).default("N"),
        status: z.enum( ['D', 'N']).default('N'),
        startDate: z.string(),
        endDate: z.string()
    }),
    params: z.object({
        facultyId: z.string(),
    })
})