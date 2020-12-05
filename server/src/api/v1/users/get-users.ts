import { Request, Response } from 'express';
import { User } from '../../../models/user.model';
import { wrapResponse } from '../../../functions/response-wrapper';
import { FindOptions } from 'sequelize';
import { buildQuery, customFilterValueResolver, QueryBuilderConfig } from '../../../functions/query-builder.func';
import { currentUserIsAdminOrMatchesId } from '../../../functions/current-user-is-admin-or-matches-id.func';

export async function getUser(req: Request, res: Response) {
    let success = true;

    if (!currentUserIsAdminOrMatchesId(req.params.id)) {
        return res.status(403).send(wrapResponse(false, { error: 'Unauthorized!' }));
    }

    let data = await User.findOne(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(error => {
            success = false;
            return null
        });
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (data === null) {
        return res.status(404).send(wrapResponse(false));
    }
    return res.send(wrapResponse(data != null, data));
}

export async function getUsers(req: Request, res: Response) {
    let query: FindOptions = {
        raw: true,
    };
    const allowedSearchFilterAndOrderFields = ['email'];
    let customResolver = new Map<string, customFilterValueResolver>();
    const queryConfig: QueryBuilderConfig = {
        query: query,
        searchString: req.query.search as string || '',
        allowLimitAndOffset: true,
        allowedFilterFields: allowedSearchFilterAndOrderFields,
        allowedSearchFields: allowedSearchFilterAndOrderFields,
        allowedOrderFields: allowedSearchFilterAndOrderFields
    }
    query = buildQuery(queryConfig, req);


    let success = true;
    let data = await User.findAll(query)
        .catch(error => {
            success = false;
            return null
        });

    return res.send(wrapResponse(success, data));
}