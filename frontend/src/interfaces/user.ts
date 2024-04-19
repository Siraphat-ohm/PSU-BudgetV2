import { RowFacultyType } from "@/types/table-z.type"

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    username?: string,
    faculties: RowFacultyType[]
}