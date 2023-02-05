import type { IOrdersResponse } from "jewl-core";
import { Order, OrderState } from "jewl-core";
import { Get, Request, Route, Security } from "tsoa";
import type { WithAuthentication } from "../../modules/auth.js";

@Route("/v1/order")
@Security("token")
export class OrderController {

    @Get("/open")
    public async getOpenOrders(@Request() req: WithAuthentication): Promise<IOrdersResponse> {
        const orders = await Order.find({ userId: req.user.userId, state: OrderState.open });
        const responses = orders.map(x => {
            return {
                executionDate: x.notBefore,
                currency: x.currency,
                amount: x.amount.minus(x.fee)
            };
        });
        return { orders: responses };
    }

}
