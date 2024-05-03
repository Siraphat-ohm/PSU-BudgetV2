import { zParse } from "../../middlewares/api-utils";
import { prisma } from "../../utils/db";
import { PsuResponse } from "../../utils/psu-response";
import { ReportSchema } from "../schemas/report.schemena";

export const ItemcodesReporting = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { startDate, endDate, status, facultyId = "0" } = zParse(ReportSchema, req).query;

        const Itemcodes = await prisma.itemCode.findMany({
            where: {
                facultyId: facultyId !== "0" ? +facultyId : undefined,
                status: status === "A" ? undefined : status
            },
            orderBy: {
                facultyId: "asc"
            },
            include: {
                faculty: true,
                product: {
                    include: {
                        plan: true
                    }
                },
                type: true,
                disItem: {
                    where: {
                        date: {
                            gte: startDate ? new Date(startDate) : undefined,
                            lte: endDate ? new Date(endDate) : undefined
                        }
                    }
                }
            }
        });

        return new PsuResponse("ok",
            Itemcodes.filter((itemcode) => itemcode.disItem.length > 0).map(({ faculty, type, product, disItem, facultyId, productId, typeId, fiscalYearId, ...rest }) => ({
                ...rest,
                faculty: faculty.name,
                type: type.name,
                product: product.name,
                plan: product?.plan?.name,
                disItems: disItem
            }))
        )

    } catch (e) {
        throw e;
    }
}

export const OverviewReporting = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { facultyId } = zParse(ReportSchema, req).query;

        const itemcodes = await prisma.itemCode.findMany({
            where: {
                facultyId: facultyId !== "0" ? +facultyId : undefined,
            },
            include: {
                faculty: true,
                product: {
                    include: {
                        plan: true
                    }
                },
                type: true,
                disItem: true
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