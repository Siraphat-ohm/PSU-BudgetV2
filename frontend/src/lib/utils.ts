import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import ApiAuth from "@/hook/ApiAuth";
import { DisItem } from "@/schema/tables/disItem";
dayjs.extend( buddhistEra );

export const convertToBE = ( date: string ) => dayjs(date).format( 'DD/MM/BBBB');

export const getFauculties = async () => {
    try {
        const res = await ApiAuth.get('/faculties');
        return res.data.data;
    } catch (e) {
        throw e;
    }
}

export const getItemcodeByFacultyId = async ( facultyId: string ) => {
    try {
        const res = await ApiAuth.get(`/itemcodes/byFacultyId/${facultyId}`);
        return res.data.data;
    } catch (e) {
        throw e;
    }
}

export const getHistory = async (id: string): Promise<DisItem &{ codeId: string; code: string; facultyId: string; faculty: string; balance: string | null}> => {
    try {
        const res = await ApiAuth.get(`/disitems/byId/${id}`)
        return res.data.data
    } catch (e) {
        throw e;
    }
}

export const getTotalHistoryPages = async ( startDate: string, endDate: string ): Promise<number> => {
    try {
        const res = await ApiAuth.get( `/disitems/pages?startDate=${startDate}&endDate=${endDate}` ) 
        return res.data.data
    } catch (error) {
        throw error;
    }
}