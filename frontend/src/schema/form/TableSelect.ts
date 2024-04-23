import { z } from "zod";

export const TableSelectSchema = z.object({
  table: z.enum( [ "1", "2", "3", "4", "5", "6", "7" ], {
    required_error: "Table is required",
    invalid_type_error: "Invalid Table"
  } )
});

export type TableSelectType = z.infer<typeof TableSelectSchema>;