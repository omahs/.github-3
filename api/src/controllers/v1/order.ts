import { Get, Route, Security } from "tsoa";

@Route("/v1/order")
@Security("token")
export class OrderController {

    @Get("/")
    public getAllOrders(): void {
        // TODO: \/
        console.log("A");
    }

}
