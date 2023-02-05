import { Schema } from "mongoose";
import type { DateTime } from "../utility/date.js";
import { DateTimeSchema } from "../utility/date.js";
import { createModel } from "../utility/mongo.js";
import type { PreciseNumber } from "../utility/number.js";
import { PreciseNumberSchema } from "../utility/number.js";

export enum OrderState {
    open = 0,
    fulfilled = 1,
    closed = 2
}

export interface IOrder {
    userId: string;
    paymentId: string;
    state: OrderState;
    notBefore: DateTime;
    currency: string;
    amount: PreciseNumber;
    fee: PreciseNumber;
    destination: string;
}

export const OrderSchema = new Schema<IOrder>({
    userId: { type: String, required: true, sparse: true },
    paymentId: { type: String, required: true, sparse: true },
    state: { type: Number, enum: OrderState, required: true },
    notBefore: { ...DateTimeSchema, required: true },
    currency: { type: String, required: true },
    amount: { ...PreciseNumberSchema, required: true },
    fee: { ...PreciseNumberSchema, required: true },
    destination: { type: String, required: true }
});

export const Order = createModel<IOrder>(OrderSchema, "orders");

export interface IOrderResponse {
    executionDate: DateTime;
    currency: string;
    amount: PreciseNumber;
}

export const OrderResponseSchema = new Schema<IOrderResponse>({
    executionDate: { ...DateTimeSchema, required: true },
    currency: { type: String, required: true },
    amount: { ...PreciseNumberSchema, required: true }
});

export const OrderResponse = createModel<IOrderResponse>(OrderResponseSchema);

export interface IOrdersResponse {
    orders: Array<IOrderResponse>;
}

export const OrdersResponseSchema = new Schema<IOrdersResponse>({
    orders: { type: [OrderResponseSchema], required: true }
});

export const OrdersResponse = createModel<IOrdersResponse>(OrdersResponseSchema);
