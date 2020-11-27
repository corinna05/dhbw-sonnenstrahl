import { Request, Response } from 'express';
import { Order } from '../../../models/order.model';
import { wrapResponse } from '../../../functions/response-wrapper';
import { FindOptions } from 'sequelize';
import { buildQuery, customFilterValueResolver, QueryBuilderConfig } from '../../../functions/query-builder.func';
import { Customer } from '../../../models/customer.models';

export async function getOrder(req: Request, res: Response) {
    let success = true;
    let orderData: Order | null = await Order.findOne(
        {
            where: {
                id: req.params.id
            }
        })
        .catch(error => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    if (orderData === null) {
        return res.status(404).send(wrapResponse(false));
    }

    let customerData = await Customer.findOne(
        {
            where: {
                id: orderData.customerId
            }
        })
        .catch(error => {
            success = false;
            return null;
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }
    // TODO formatting: How to return this nicely in one object?
    return res.send(wrapResponse(true, { orderData, customerData }));
}

export async function getOrders(req: Request, res: Response) {
    let query: FindOptions = {
        raw: true,
    };
    const allowedSearchFields = ['referrer'];
    const allowedFilterFields = ['customerId', 'planId', 'referrer', 'consumption'];
    const allowedOrderFields = ['customerId', 'planId', 'referrer', 'consumption'];
    let customResolver = new Map<string, customFilterValueResolver>();
    customResolver.set('is_active', (field: string, req: Request, value: string) => {
        return true;
    });
    const queryConfig: QueryBuilderConfig = {
        query: query,
        searchString: req.query.search as string || '',
        customFilterResolver: customResolver,
        allowLimitAndOffset: true,
        allowedFilterFields: allowedFilterFields,
        allowedSearchFields: allowedSearchFields,
        allowedOrderFields: allowedOrderFields
    }
    query = buildQuery(queryConfig, req);

    let orderdata;
    let success = true;
    await Order.findAll(query)
        .then((order) => orderdata = order)
        .catch(error => {
            success = false;
            orderdata = [];
        }
        );
    if (!success) {
        return res.status(500).send(wrapResponse(false, { error: 'Database error' }));
    }

    return res.send(wrapResponse(true, orderdata));
}
