import { Decimal } from "@prisma/client/runtime/library";
import { zParse } from "../../middlewares/api-utils";
import { PsuResponse } from "../../utils/psu-response";
import PsuError from "../../utils/error";
import Logger from "../../utils/logger";
import { countDisItem, createDisItem, getAllDisItem, getDisItemById, getDisItemByIdWithItem, removeDisbursement, updateDisItem } from "../services/disItem.services";
import { getItemcodeById, updateItemcode } from "../services/itemcode.services";
import { DisbursementEditSchema, DisbursementsFetchSchema, DisbursementFetchSchema, DisbursementRemoveSchema, DisbursementSchema } from "../schemas/disItem.shcema";

export const disburseFunds = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: { codeId, date, psuCode,  amount, note } } = await zParse( DisbursementSchema , req);

        const { balance } = await getItemcodeById(codeId);
        const dec_amount = new Decimal(amount);

        if (dec_amount.lessThan(0)) throw new PsuError(404, "Amount must be greater than 0.");

        const newBalance = balance.minus(dec_amount);

        if (newBalance.lessThan(0)) throw new PsuError(404, "Insufficient balance");

        const disbursedPromise = createDisItem({
            psuCode,
            withdrawalAmount: dec_amount,
            date,
            userId: req.ctx.decodedToken.id,
            codeId,
            note: note ?? "-"
        });

        const updateBalancePromise = updateItemcode({ id: codeId }, { balance: newBalance });

        await Promise.all([disbursedPromise, updateBalancePromise]);

        Logger.info(`userId: ${req.ctx.decodedToken.id} disbursed codeId: ${codeId} amount: ${amount}`);

        return new PsuResponse("Disbursement complete", {});
    } catch (e) {
        Logger.error(`Error on disburseFunds: ${JSON.stringify(e)}`);
        throw e;
    }
};

export const updateDisbursement = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: { facultyId, amount, codeId, ...rest }, params: { id } } = zParse( DisbursementEditSchema, req);

        const { balance } = await getItemcodeById(codeId);
        const { withdrawalAmount } = await getDisItemById(+id);
        const dec_amount = new Decimal(amount);

        if (dec_amount.lessThan(0)) throw new PsuError(404, "Amount must be greater than 0.");

        const newBalance = balance.add(withdrawalAmount).minus(amount);

        if (newBalance.lessThan(0)) throw new PsuError(404, "Insufficient balance");

        const updateDisItemPromise = updateDisItem({ id: +id }, { withdrawalAmount: dec_amount, ...rest });
        const updateBalancePromise = updateItemcode({ id: codeId }, { balance: newBalance });

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
        const { decodedToken: { id: userId } } = req.ctx;
        const { page = 1, limit = 10, startDate, endDate } = zParse( DisbursementsFetchSchema, req).query;

        const pageNumber = +page;
        const itemsPerPage = +limit;

        const where = {
            userId,
            date: {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined
            }
        };

        const skip = (pageNumber - 1) * itemsPerPage;
        const take = itemsPerPage;

        const allDisbursements = await getAllDisItem({
            where,
            skip,
            take,
            include: {
                code: {
                    select: {
                        code: true
                    }
                }
            },
            orderBy: {
                date: "desc"
            }
        });

        Logger.info(`UserId: ${userId}, fetched all disbursements`);

        const formattedDisbursements = allDisbursements.map(disbursement => ({
            ...disbursement,
            code: disbursement?.code?.code
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

        const totalDisbursements = await countDisItem( { where } );
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
        const { code: {  facultyId, balance, code }, withdrawalAmount, ...rest } = await getDisItemByIdWithItem(+id);

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
        const { codeId, withdrawalAmount } = await getDisItemById(+id);
        const { balance } = await getItemcodeById(codeId);

        const newBalance = balance.add(withdrawalAmount);

        const deleteDisbursementPromise =  removeDisbursement(+id);
        const updateBalancePromise = updateItemcode({ id: codeId }, { balance: newBalance });

        await Promise.all([deleteDisbursementPromise, updateBalancePromise]);

        Logger.info(`UserId: ${req.ctx.decodedToken.id}, removed disbursement by id: ${id}`);

        return new PsuResponse("ok", {});
    } catch (e) {
        Logger.error(`Error occurred while removing disbursement by id: ${JSON.stringify(e)}`);
        throw e;
    }
}