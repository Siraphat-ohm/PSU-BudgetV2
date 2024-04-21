import { Decimal } from "@prisma/client/runtime/library";
import { zParse } from "../../middlewares/api-utils";
import { prisma } from "../../utils/db";
import { PsuResponse } from "../../utils/psu-response";
import { DisbursedSchema, EditSchema, FetchHistoriesSchema, RemoveDisItemSchema, SummarySchema } from "../schemas/budget.schema";
import PsuError from "../../utils/error";
import Logger from "../../utils/logger";
import { Prisma } from "@prisma/client";

export const handleDisbured = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: { codeId, amount, date, facultyId, psuCode, note } } = zParse(DisbursedSchema, req);
        const { balance } = await prisma.item.findFirstOrThrow({ where: { id: codeId }, select: { balance: true } });

        const dec_Amount = new Decimal(amount)
        const newBalance = balance.minus(dec_Amount)

        if (dec_Amount.lessThan(0)) throw new PsuError(404, "Amount must be greather than 0.")
        if (newBalance.lessThan(0)) throw new PsuError(404, "Insufficient balance");

        const createDisItem = prisma.disbursedItem.create({
            data: {
                psuCode,
                withdrawalAmount: dec_Amount,
                date,
                userId: req.ctx.decodedToken.id,
                codeId,
                note: note ?? "-"
            }
        });

        const updateBalance = prisma.item.update({
            where: { id: codeId },
            data: {
                balance: newBalance
            }
        });
        await Promise.all([createDisItem, updateBalance])

        return new PsuResponse("Disbured complete", {});
    } catch (e) {
        throw e;
    }
};

export const fetchHistories = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { id } = req.ctx.decodedToken;
        const { page, limit, startDate, endDate } = zParse(FetchHistoriesSchema, req).query;

        const pageNumber = +page || 1;
        const itemsPerPage = +limit || 10;

        const user = await prisma.user.findFirstOrThrow({ where: { id } });

        const whereCondition: Prisma.DisbursedItemWhereInput = {
            user: user,
            date: {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined
            }
        };


        const histories = await prisma.disbursedItem.findMany({
            where: whereCondition,
            skip: (pageNumber - 1) * itemsPerPage,
            take: itemsPerPage,
            orderBy: {
                id: "desc",
            },
            include: {
                code: {
                    select: {
                        code: true,
                    },
                },
            },
        });

        return new PsuResponse("ok", histories.map((history) => ({
            ...history,
            code: history.code.code
        })))

    } catch (e) {
        console.log(e);

        throw e;
    }
};

export const fetchHistoryPages = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { id } = req.ctx.decodedToken;
        const { limit, startDate, endDate } = zParse( FetchHistoriesSchema, req ).query;
        const itemsPerPage = +limit || 10;

        const user = await prisma.user.findFirstOrThrow({ where: { id } });
        const whereCondition: Prisma.DisbursedItemWhereInput = {
            user: user,
            date: {
                gte: startDate ? new Date(startDate) : undefined,
                lte: endDate ? new Date(endDate) : undefined
            }
        };
        const totalHistoryCount = await prisma.disbursedItem.count({ where: whereCondition });

        return new PsuResponse("ok", Math.ceil(totalHistoryCount / itemsPerPage),);
    } catch (e) {
        throw e;
    }
}

export const fetchHistory = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { params: { id } } = zParse(RemoveDisItemSchema, req);
        const { code: { faculty: { id: facultyId }, balance, code }, withdrawalAmount, ...rest } = await prisma.disbursedItem.findFirstOrThrow({
            where: { id: +id },
            include: {
                code: {
                    select: {
                        code: true,
                        balance: true,
                        faculty: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            }
        });

        return new PsuResponse("ok", { ...rest, facultyId, balance: balance.add(withdrawalAmount), withdrawalAmount, code });
    } catch (e) {
        throw e;
    }
}

export const editHistory = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {

        const { body: { facultyId, amount, codeId, ...rest }, params: { id } } = zParse(EditSchema, req);
        const { balance } = await prisma.item.findFirstOrThrow({ where: { id: codeId }, select: { balance: true } });
        const { withdrawalAmount } = await prisma.disbursedItem.findFirstOrThrow({ where: { id: +id } });

        const { id: userId } = req.ctx.decodedToken;
        const dec_Amount = new Decimal(amount)

        if (dec_Amount.lessThan(0)) throw new PsuError(404, "Amount must be greather than 0.")

        const newBalance = balance.add(withdrawalAmount).minus(amount)

        if (newBalance.lessThan(0)) throw new PsuError(404, "Insufficient balance");

        const updateDisItem = prisma.disbursedItem.create({
            data: {
                withdrawalAmount: amount,
                codeId: codeId,
                userId,
                ...rest
            }
        });

        const updateBalance = prisma.item.update({
            where: { id: codeId },
            data: {
                balance: newBalance
            }
        });

        await Promise.all([updateDisItem, updateBalance]);

        Logger.info(`userId: ${userId} update history ${id}`);

        return new PsuResponse("Update history complete", {});

    } catch (e) {
        throw e;
    }
}

export const removeDisItem = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { params: { id } } = zParse(RemoveDisItemSchema, req);

        await prisma.$transaction(async (prisma) => {
            const itemToUpdate = await prisma.disbursedItem.findUniqueOrThrow({
                where: { id: +id },
                select: {
                    codeId: true,
                    withdrawalAmount: true,
                },
            });

            await prisma.item.update({
                where: { id: itemToUpdate.codeId },
                data: { balance: { increment: itemToUpdate.withdrawalAmount } },
            });

            return await prisma.disbursedItem.delete({ where: { id: +id } });
        });
        return new PsuResponse("ok", {})
    } catch (e) {
        throw e;
    }
}

export const handleSummanry = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { query: { status, mode, endDate, startDate }, params: { facultyId } } = zParse(SummarySchema, req);

        const whereCondition: Prisma.DisbursedItemWhereInput = {
            date: {
                gte: startDate,
                lte: endDate
            },

        }

        if (facultyId !== "0") {
            whereCondition.code = {
                facultyId: +facultyId,
                status
            }
        }

        if (mode === "N") {
            const disItmes = await prisma.disbursedItem.findMany({
                where: whereCondition,
                include: {
                    code: {
                        select: {
                            code: true,
                            balance: true,
                            faculty: {
                                select: {
                                    name: true
                                }
                            },
                            product: {
                                select: {
                                    name: true,
                                    plan: {
                                        select: {
                                            name: true
                                        }
                                    }
                                }
                            },
                            type: {
                                select: {
                                    name: true
                                }
                            },

                        }
                    }
                }
            });

            const results = disItmes.map(({ code: { balance, code, faculty, product: { name: productName, plan }, type }, ...rest }) => {
                return {
                    code,
                    balance,
                    facultyName: faculty.name,
                    productName,
                    planName: plan?.name,
                    ...rest
                }
            })
            return new PsuResponse("ok", results);
        } else if (mode === "O") {
            const disItems = await prisma.disbursedItem.findMany({

            });
        } else if (mode === "B") {
            const disItems = await prisma.disbursedItem.findMany({

            });

        } else if (mode === "D") {
            const disItems = await prisma.disbursedItem.findMany({
                where: whereCondition,
                include: {
                    code: {
                        select: {
                            code: true,
                            totalAmount: true,
                        }
                    }
                }
            });

            const results = disItems.map(({ code: { code, totalAmount }, ...rest }) => {
                return {
                    code,
                    totalAmount,
                    ...rest
                }
            });

            return new PsuResponse("ok", results);
        }
        throw new PsuError(404, "Mode not found")
    } catch (e) {
        throw e;
    }
}