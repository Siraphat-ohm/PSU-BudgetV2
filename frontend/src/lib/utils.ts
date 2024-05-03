import ApiAuth from "@/hook/ApiAuth";
import { ReportedMode, ReportedStatus } from "./mappings";
import { DisItem, Faculty } from "@/schema/Table";
import { ItemcodeReport, OverviewReport } from "@/schema/Report";

export const getFauculties = async () => {
    try {
        const res = await ApiAuth.get('/faculties');
        return res.data.data;
    } catch (e) {
        throw e;
    }
}

export const getFaucultiesByUserId = async (  ): Promise<Faculty[]> => {
    try {
        const res = await ApiAuth.get(`/faculties/byUserId`);
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

export const getHistory = async (id: string): Promise<DisItem &{ 
    codeId: string; 
    code: string; 
    facultyId: string; 
    faculty: string; 
    balance: string | null}> => {
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

type params = {
    startDate: string;
    endDate: string;
    mode: ReportedMode;
    status: ReportedStatus | undefined;
    facultyId: number | undefined;
}

export const getItemcodeReportedData = async ( params: params ) : Promise<ItemcodeReport[] | null> => {
    try {
        const { startDate, endDate, status, facultyId } = params;
        if (facultyId && status) {
            const res = await ApiAuth.get(`/report/itemcodes/?startDate=${startDate}&endDate=${endDate}&status=${status}&facultyId=${facultyId}`)
            return res.data.data;
        }
        return null;
    } catch (error) {
        throw error;
    }
}

export const getOverviewReportedData = async ( params: params ) : Promise<OverviewReport[] | null> => {
    const { startDate, endDate, mode, status, facultyId } = params;
    try {
        if (facultyId && status) {
            const res = await ApiAuth.get(`/report/overview/?startDate=${startDate}&endDate=${endDate}&mode=${mode}&status=${status}&facultyId=${facultyId}`)
            return res.data.data;
        }
        return null;
    } catch (error) {
        throw error;
    }
}