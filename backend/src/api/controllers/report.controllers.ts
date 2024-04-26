import { zParse } from "../../middlewares/api-utils";
import { PsuResponse } from "../../utils/psu-response";
import { ReportSchema } from "../schemas/report.schemena";
import { getAllDisItemWithAllRelation } from "../services/disItem.services";
import { getAllItemcodesWithAllRelation } from "../services/itemcode.services";

export const ItemcodesReporting = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { startDate, endDate, status = "N", facultyId ="0" } = zParse(ReportSchema, req).query;
        console.log({ startDate, endDate, status, facultyId });
        console.log(facultyId !== "0" ? +facultyId : undefined);
         
        const Itemcodes = await getAllItemcodesWithAllRelation({
            where: {
                status,
                facultyId: facultyId !== "0" ? +facultyId : undefined,
                disItem: {
                    every: {
                        date: {
                            gte: startDate ? new Date(startDate) : undefined,
                            lte: endDate ? new Date(endDate) : undefined
                        }
                    }
                },
            },
            orderBy: {
                facultyId: "asc"
            }
        });

        return new PsuResponse("ok", 
            Itemcodes.filter((itemcode) => itemcode.disItem.length > 0).map( ( { faculty, type, product, disItem, facultyId, productId, typeId, fiscalYearId, ...rest } ) => ({
                ...rest,
                faculty: faculty.name,
                type: type.name,
                product: product.name,
                plan: product?.plan?.name,
                disItems : disItem
                }))
        )
        
    } catch (e) {
        throw e;
    }
}

export const DeprivationReporting = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { startDate, endDate, status = "D", facultyId } = zParse(ReportSchema, req).query;
        const Itemcodes = await getAllItemcodesWithAllRelation({
            where: {
                status,
                facultyId: facultyId !== "0" ? +facultyId : undefined,
                disItem: {
                    every: {
                        date: {
                            gte: startDate ? new Date(startDate) : undefined,
                            lte: endDate ? new Date(endDate) : undefined
                        }
                    }
                },
            },
            orderBy: {
                facultyId: "asc"
            }
        });

        return new PsuResponse("ok", 
            Itemcodes.filter((itemcode) => itemcode.disItem.length > 0).map( ( { faculty, type, product, disItem, facultyId, productId, typeId, fiscalYearId, ...rest } ) => ({
                ...rest,
                faculty: faculty.name,
                type: type.name,
                product: product.name,
                plan: product?.plan?.name,
                disItems : disItem
                }))
        )

    } catch (e) {
        throw e;
    }
}

export const OverviewReporting = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { facultyId } = zParse(ReportSchema, req).query;

        const itemcodes = await getAllItemcodesWithAllRelation({
            where: {
                facultyId: facultyId !== "0" ? +facultyId : undefined,
            }
        });
        return new PsuResponse("ok", itemcodes.map(({ faculty, product, type, disItem, fiscalYearId, ...rest }) => ({
            ...rest,
            faculty: faculty.name,
            product: product.name,
            type: type.name,
            plan: product?.plan?.name,
        })))
    } catch (e) {
        throw e;
    }
}