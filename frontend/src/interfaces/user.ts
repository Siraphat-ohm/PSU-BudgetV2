import { Faculty } from "@/schema/Table";

export interface User {
    id: number,
    firstName: string,
    lastName: string,
    username?: string,
    faculties: Faculty[]
}