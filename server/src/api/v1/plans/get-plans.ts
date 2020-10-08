import {Plan} from "../../../models/plan.model";
import {Request, Response} from "express";
import {FindOptions, Op} from "sequelize";
import {wrapResponse} from "../../../functions/response-wrapper";
import {
    buildQuery,
    customFilterValueResolver, QueryBuilderConfig
} from "../../../functions/query-builder.func";

export async function getPlans(req: Request, res: Response) {
    let query: FindOptions = {
        raw: true,
    };
    const allowedSearchFields = ['plan', 'postcode'];
    const allowedOrderFields = ['postcode', 'plan', 'usage_max', 'usage_min', 'cost_var', 'cost_n_var', 'cost_fix'];
    const allowedFilterFields = ['id', 'postcode', 'plan', 'is_active'];

    let customResolver = new Map<string, customFilterValueResolver>();
    customResolver.set('is_active', (field: string, req: Request, value: string) => {
        return true;
    });

    const queryConfig: QueryBuilderConfig = {
        query: query,
        customFilterResolver: customResolver,
        allowLimitAndOffset: true,
        allowedFilterFields: allowedFilterFields,
        allowedSearchFields: allowedSearchFields,
        allowedOrderFields: allowedOrderFields
    }
    query = buildQuery(queryConfig, req);

    let data: unknown = [];
    await Plan.findAll(query).then(d => {
        data = d;
    });
    return res.send(wrapResponse(true, data));
}

export async function getPlan(req: Request, res: Response) {
    let data;
    await Plan.findOne({
        where: {
            id: req.params.id
        },
        raw: true
    }).then(
        d => {
            data = d;
        }
    )

    return res.send(wrapResponse(true, data));
}