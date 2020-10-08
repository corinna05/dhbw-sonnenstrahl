import {IncomingPlan, InternalPlan} from '../../../interfaces/plan.interface';
import {Request, Response} from 'express';
import {wrapResponse} from '../../../functions/response-wrapper';
import isBlank from 'is-blank';
import {mapPlans} from '../../../functions/map-plans.func';
import {UploadedFile} from 'express-fileupload';
import {Plan} from "../../../models/plan.model";

export async function importPlan(req: Request, res: Response) {
    try {
        if (isBlank(req.files) || req.files === undefined || req.files.file == null) {
            throw 'No file uploaded';
        }
        // flatten
        const file = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;
        const incomingData = await loadCSV(file);
        const targetData: InternalPlan[] = incomingData.map(mapPlans);
        await deactivatePlans();
        targetData.forEach(createPlanEntry);
        res.send(wrapResponse(true, targetData));
    } catch (e) {
        res.send(wrapResponse(false, {error: e}));
        return;
    }
}

async function loadCSV(file: UploadedFile): Promise<IncomingPlan[]> {
    const csv = require('csvtojson');
    return csv({delimiter: ";"}).fromFile(file.tempFilePath);
}

function deactivatePlans(): Promise<any> {
    return Plan.update(
        {
            is_active: false
        },
        {
            where: {
                is_active: true
            }
        }
    );
}

function createPlanEntry(data: InternalPlan) {
    Plan.create({
        plan: data.plan,
        postcode: data.postcode,
        cost_fix: data.cost_fix,
        cost_var: Math.floor(data.cost_var * 10000),
        cost_n_var: Math.floor(data.cost_n_var * 10000),
        usage_max: data.usage_max,
        usage_min: data.usage_min,
        usage_n_max: data.usage_n_max,
        usage_n_min: data.usage_n_min,
    })
}