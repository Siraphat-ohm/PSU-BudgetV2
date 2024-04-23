import { Faculty } from "@/schema/tables/faculty";

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    username?: string,
    faculties: Faculty[]
}