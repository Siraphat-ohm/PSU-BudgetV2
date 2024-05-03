import { zParse } from "../../middlewares/api-utils";
import { prisma } from "../../utils/db";
import PsuError from "../../utils/error";
import Logger from "../../utils/logger";
import { PsuResponse } from "../../utils/psu-response";
import { PlanSchema } from "../schemas/plan.shema";

export const createPlans = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const { body: plans } = zParse(PlanSchema, req);

        if (!plans || plans.length === 0) {
            throw new PsuError(400, "No plans to import");
        }

        await prisma.plan.createMany({
            data: plans
        });

        Logger.info("Import plans successfully")
        return new PsuResponse("success", {})
    } catch (e) {
        Logger.error(`Error on plan importing :${JSON.stringify(e)}`)
        throw e;
    }
}

export const fetchAllPlans = async (req: PsuTypes.Request): Promise<PsuResponse> => {
    try {
        const plans = await prisma.plan.findMany();
        Logger.info("Fetched all plans");
        return new PsuResponse("success", plans);
    } catch (e) {
        Logger.error(`Error fetching all plans: ${JSON.stringify(e)}`);
        throw e;
    }
}