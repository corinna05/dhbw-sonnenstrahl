import {Request, Response} from 'express';
import {Sequelize} from 'sequelize-typescript';
import {wrapResponse} from '../../../functions/response-wrapper';
import {Order} from '../../../models/order.model';

export async function getReferrerStats(req: Request, res: Response): Promise<Response> {
    let success = true;
    const result = await Order.findAll(
        {
            attributes: ['referrer', [Sequelize.fn('COUNT', Sequelize.col('referrer')), 'count']],
            group: 'referrer',
        })
        .catch(error => {
            success = false;
            return [];
        });

    if (!success) {
        return res.status(500).send(wrapResponse(false, {error: 'Database error'}));
    }

    return res.send(wrapResponse(true, result));
}