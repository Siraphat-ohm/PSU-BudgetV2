import { zParse } from "../../middlewares/api-utils";
import Logger from "../../utils/logger";
import { PsuResponse } from "../../utils/psu-response";
import { PlanSchema } from "../schemas/plan.shema";
import { upsertPlan } from "../services/plan.services";

export const createPlans = async ( req: PsuTypes.Request ): Promise<PsuResponse> => {
    try {
        const { body: plans } = zParse( PlanSchema, req );
        await Promise.all(plans.map(async ( plan ) => await upsertPlan( plan.id, plan )))
        Logger.info("Import plans successfully")
        return new PsuResponse( "success", {} )
    } catch (e) {
        Logger.error( `Error on plan importing :${JSON.stringify( e )}`)
        throw e;
    }
}