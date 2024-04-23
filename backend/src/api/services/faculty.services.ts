import { Prisma, Faculty } from "@prisma/client";
import { prisma, prismaExclude } from "../../utils/db";

export const upsertFaculty = async ( id: number, data: Prisma.FacultyCreateInput ): Promise<Faculty> => {
    try {
        const faculty = await prisma.faculty.upsert({ 
            create: data,
            update: data,
            where: { id }
        });
        return faculty;
    } catch (e) {
        throw e;        
    }
}

export const getAllFaculty = async (): Promise<Partial<Faculty>[]> => {
    try {
        const faculties = await prisma.faculty.findMany({ select: prismaExclude("Faculty", ["userId"]) });

        return faculties;
    } catch (e) {
        throw e;
    }
}

export const getFacultiesByUserId = async (userId: number) => {
    try {
        const faculties = await prisma.faculty.findMany({
            select: prismaExclude("Faculty", ["userId"]),
            where: { userId }
        });

        return faculties;
    } catch (e) {
        throw e;
    }

}