import { Decimal } from "@prisma/client/runtime/library";
import { zParse } from "../../middlewares/api-utils";
import { prisma } from "../../utils/db";
import { PsuResponse } from "../../utils/psu-response";
import { DisbursedSchema, EditSchema, FetchHistoriesSchema, RemoveDisItemSchema } from "../schemas/budget.schema";
import PsuError from "../../utils/error";
import Logger from "../../utils/logger";

export const handleDisbured = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: { codeId, amount, date, facultyId, psuCode, note } } = zParse(DisbursedSchema, req);
        const { balance } = await prisma.item.findFirstOrThrow({ where: { id: codeId }, select: { balance: true } });

        const dec_Amount = new Decimal(amount)
        const newBalance = balance.minus(dec_Amount)

        if ( dec_Amount.lessThan( 0 )  ) throw new PsuError(404, "Amount must be greather than 0.")
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
        const { id } = req.ctx.decodedToken
        const { query: { page, limit } } = zParse(FetchHistoriesSchema, req);
        const int_Page = +page;
        const int_limit = +limit;
        const user = await prisma.user.findFirstOrThrow({ where: { id } })
        const totalHistoryCount = await prisma.disbursedItem.count({
            where: {
                user: user
            }
        });
        const histories = await prisma.disbursedItem.findMany({
            where: {
                user: user
            },
            skip: (int_Page - 1) * int_limit,
            take: int_limit,
            orderBy: {
                id: "desc",
            },
            include: {
                code: {
                    select: {
                        code: true
                    }
                }
            }
        });
        
        return new PsuResponse("ok", {
            histories: histories.map(({ code: { code }, ...rest }) => { return { ...rest, code } })
            , maxPage: Math.ceil(totalHistoryCount / int_limit)
        })
    } catch (e) {
        throw e;
    }
};

export const fetchHistory = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { params: { id } } = zParse(RemoveDisItemSchema, req);
        const { code: { faculty: { id:facultyId }, balance, code }, withdrawalAmount, ...rest } = await prisma.disbursedItem.findFirstOrThrow({
            where: { id: +id },
            include: {
                code: {
                    select: {
                        code: true,
                        balance:true,
                        faculty: {
                            select: {
                                id: true
                            }
                        }
                    }
                }
            }
        });

        return new PsuResponse("ok", {...rest, facultyId, balance: balance.add( withdrawalAmount ), withdrawalAmount, code } );
    } catch (e) {
        throw e;
    }
}

export const editHistory = async( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        
        const { body: { facultyId, amount, codeId, ...rest }, params: { id } } = zParse( EditSchema, req );
        const { balance } = await prisma.item.findFirstOrThrow({ where: { id: codeId }, select: { balance: true } });
        const { withdrawalAmount } = await prisma.disbursedItem.findFirstOrThrow({ where: { id: +id } } );

        const { id: userId } = req.ctx.decodedToken;
        const dec_Amount = new Decimal( amount )

        if ( dec_Amount.lessThan( 0 )  ) throw new PsuError(404, "Amount must be greather than 0.")
       
        const newBalance = balance.add( withdrawalAmount ).minus( amount )

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

        await Promise.all( [ updateDisItem, updateBalance ] );
       
        Logger.info( `userId: ${userId} update history ${id}` );

        return new PsuResponse("Update history complete", {} );

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