import { Decimal } from "@prisma/client/runtime/library";
import { zParse } from "../../middlewares/api-utils";
import { PsuResponse } from "../../utils/psu-response";
import PsuError from "../../utils/error";
import Logger from "../../utils/logger";
import { 
    DisbursementEditSchema, 
    DisbursementsFetchSchema, 
    DisbursementFetchSchema, 
    DisbursementRemoveSchema,
    DisbursementSchema,
    DisbursementCreateManySchema, 
} from "../schemas/disItem.shcema";
import { prisma } from "../../utils/db";

export const disburseFunds = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: { codeId, date, psuCode,  withdrawalAmount, note } } = zParse( DisbursementSchema , req);
        const { balance } = await prisma.itemCode.findUniqueOrThrow({ where: { id: codeId } });
        const dec_amount = new Decimal(withdrawalAmount);

        if (dec_amount.lessThan(0)) throw new PsuError(404, "Amount must be greater than 0.");

        const newBalance = balance.minus(dec_amount);

        if (newBalance.lessThan(0)) throw new PsuError(404, "Insufficient balance");

        const disbursedPromise = prisma.disbursedItem.create({
            data: {
                psuCode,
                withdrawalAmount: dec_amount,
                date,
                userId: req.ctx.decodedToken.id,
                codeId,
                note: note ?? "-"
            }
        });
        
        const updateBalancePromise = prisma.itemCode.update({
            where: { id: codeId },
            data: { balance: newBalance }
        });

        await Promise.all([disbursedPromise, updateBalancePromise]);

        Logger.info(`userId: ${req.ctx.decodedToken.id} disbursed codeId: ${codeId} amount: ${withdrawalAmount}`);

        return new PsuResponse("Disbursement complete", {});
    } catch (e) {
        Logger.error(`Error on disburseFunds: ${JSON.stringify(e)}`);
        throw e;
    }
};

export const updateDisbursement = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: {  withdrawalAmount: amount, codeId, ...rest }, params: { id } } = zParse( DisbursementEditSchema, req);


        const { balance } = await prisma.itemCode.findUniqueOrThrow({ where: { id: codeId } });

        const { withdrawalAmount } = await prisma.disbursedItem.findUniqueOrThrow({ where: { id: +id } });
        const dec_amount = new Decimal(amount);
        

        if (dec_amount.lessThan(0)) throw new PsuError(404, "Amount must be greater than 0.");

        const newBalance = balance.add(withdrawalAmount).minus(amount);

        if (newBalance.lessThan(0)) throw new PsuError(404, "Insufficient balance");

        const updateDisItemPromise = prisma.disbursedItem.update({ where: { id: +id }, data: { withdrawalAmount: dec_amount, ...rest } });
        const updateBalancePromise = prisma.itemCode.update({ where: { id: codeId }, data: { balance: newBalance } });

        await Promise.all([updateDisItemPromise, updateBalancePromise]);

        Logger.info(`userId: ${req.ctx.decodedToken.id} updated history ${id}`);

        return new PsuResponse("Update complete", {});
    } catch (e) {
        Logger.error(`Error on updateDisbursement: ${JSON.stringify(e)}`);
        throw e;
    }
};

export const fetchAllDisbursements = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { decodedToken: { id: userId }, fiscalYearId } = req.ctx;
        const allDisbursements = await prisma.disbursedItem.findMany({});

        Logger.info(`UserId: ${userId}, fetched all disbursements`);
        
        return new PsuResponse("ok", allDisbursements);

    } catch (e) {
        Logger.error(`Error occurred while fetching all disbursements: ${JSON.stringify(e)}`);
        throw e;
    }
}

export const fetchHistoriesByPage = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { decodedToken: { id: userId }, fiscalYearId } = req.ctx;
        const { page = 1, limit = 10, startDate, endDate, psuCode } = zParse( DisbursementsFetchSchema, req).query;

        const pageNumber = +page;
        const itemsPerPage = +limit;

        const take = itemsPerPage;


        const allDisbursements = await prisma.disbursedItem.findMany({
            where: {
                psuCode: {
                    contains: psuCode
                },
                userId,
                date: {
                    gte: startDate ? new Date(startDate) : undefined,
                    lte: endDate ? new Date(endDate) : undefined
                },
                code: {
                    fiscalYearId
                }
            },
            skip: (pageNumber - 1) * itemsPerPage,
            take,
            orderBy: {
                date: "desc"
            },
            include: {
                code: {
                    select: {
                        code: true
                    }
                }
            }
        });

        Logger.info(`UserId: ${userId}, fetched all disbursements`);

        const formattedDisbursements = allDisbursements.map(disbursement => ({
            ...disbursement,
            code: disbursement.code.code
        }));

        return new PsuResponse("ok", formattedDisbursements);
    } catch (e) {
        Logger.error(`Error occurred while fetching all disbursements: ${JSON.stringify(e)}`);
        throw e;
    }
};

export const fetchDisbursementPages = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { decodedToken: { id: userId } } = req.ctx;
        const { startDate, endDate } = zParse( DisbursementsFetchSchema, req).query;

        const where = {
            userId,
            date: {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined
            }
        };

        const totalDisbursements = await prisma.disbursedItem.count({ where });
        Logger.info(`UserId: ${userId}, fetched disbursement pages`);

        return new PsuResponse("ok", Math.ceil(totalDisbursements / 10));
    } catch (e) {
        Logger.error(`Error occurred while fetching disbursement pages: ${JSON.stringify(e)}`);
        throw e;
    }
}

export const fetchDisbursementById = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { id } = zParse( DisbursementFetchSchema, req).params;
        const { code: {  facultyId, balance, code }, withdrawalAmount, ...rest } = await prisma.disbursedItem.findUniqueOrThrow({ 
            where: { id: +id },
            include: {
                code: {
                    select: {
                        facultyId: true,
                        balance: true,
                        code: true
                    }
                }
            }
        },);

        Logger.info(`UserId: ${req.ctx.decodedToken.id}, fetched disbursement by id: ${id}`);

        return new PsuResponse("ok", { ...rest, facultyId, balance: balance.add(withdrawalAmount), withdrawalAmount, code });
    } catch (e) {
        Logger.error(`Error occurred while fetching disbursement by id: ${JSON.stringify(e)}`);
        throw e;
    }
}

export const removeDisbursementById = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { id } = zParse( DisbursementRemoveSchema, req).params;
        const { codeId, withdrawalAmount } = await prisma.disbursedItem.findUniqueOrThrow({ where: { id: +id }, select: { codeId: true, withdrawalAmount: true } });
        const { balance } = await prisma.itemCode.findUniqueOrThrow({ where: { id: codeId } });

        const newBalance = balance.add(withdrawalAmount);

        const deleteDisbursementPromise = prisma.disbursedItem.delete({ where: { id: +id } });
        const updateBalancePromise = prisma.itemCode.update({ where: { id: codeId }, data: { balance: newBalance } });

        await Promise.all([deleteDisbursementPromise, updateBalancePromise]);

        Logger.info(`UserId: ${req.ctx.decodedToken.id}, removed disbursement by id: ${id}`);

        return new PsuResponse("success", {});
    } catch (e) {
        Logger.error(`Error occurred while removing disbursement by id: ${JSON.stringify(e)}`);
        throw e;
    }
}

export const createDisbursement = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: disItems } = zParse( DisbursementCreateManySchema, req);

        
        if (disItems.length === 0) throw new PsuError(404, "No disbursement items found");

        await prisma.disbursedItem.createMany({
            data: disItems
        });

        return new PsuResponse("ok", {});
    } catch (e) {
        Logger.error(`Error occurred while creating disbursement: ${JSON.stringify(e)}`);
        throw e;
    }
}