import { string, z } from "zod";

export const DisbursedSchema = z.object({
    body: z.object({
        facultyId: z.number(),
        codeId: z.number(),
        amount: z.string(),
        psuCode: z.string(),
        date: z.string(),
        note: z.string().optional()
    })
});

export const EditSchema = z.object({
    body: z.object({
        facultyId: z.number(),
        amount: z.string(),
        psuCode: z.string(),
        date: z.string(),
        note: z.string().optional(),
        codeId: z.number()
    }),
    params: z.object({
        id: string()
    })
})

export const FetchHistoriesSchema = z.object({
    query: z.object({
        page: z.string().optional().default("1"),
        limit: z.string().optional().default("10")
    })
});

export const RemoveDisItemSchema = z.object({
    params: z.object({
        id: z.string({
            required_error: "Id is required.",
            invalid_type_error: "Id must be string."
        })
    })
});
