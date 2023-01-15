import type { Model } from "mongoose";
import type { ICoinbaseAccount, ICoinbaseBook, ICoinbaseOrder, ICoinbaseProduct } from "../entities/coinbase.js";
import { CoinbaseProducts, CoinbaseOrder, CoinbaseOrders, CoinbaseCancel, CoinbaseAccounts, CoinbaseBook } from "../entities/coinbase.js";
import type { IRequest } from "../utility/client.js";
import { Client } from "../utility/client.js";
import isomorphic from "jewl-isomorphic";
import type { PreciseNumber } from "../utility/number.js";

export class CoinbasePublicClient extends Client {
    public constructor() {
        const staticHeaders: Record<string, string> = {
            "Content-Type": "application/json"
        };
        super("https://api.exchange.coinbase.com/", staticHeaders);
    }

    public async getProducts(): Promise<Array<ICoinbaseProduct>> {
        const request: IRequest = {
            endpoint: "products"
        };

        const response = await this.request(request, CoinbaseProducts);

        return response.list
            .filter(x => x.base_currency === "EUR" || x.quote_currency === "EUR")
            .filter(x => !x.post_only)
            .filter(x => !x.cancel_only)
            .filter(x => x.status === "online")
            .filter(x => !x.auction_mode)
            .filter(x => !x.trading_disabled);
    }
}

export class CoinbaseClient extends Client {
    private readonly secret: string;

    public constructor(key: string, secret: string, pass: string) {
        const staticHeaders: Record<string, string> = {
            "Content-Type": "application/json",
            "CB-ACCESS-KEY": key,
            "CB-ACCESS-PASSPHRASE": pass
        };
        super("https://api.exchange.coinbase.com/", staticHeaders);
        this.secret = secret;
    }

    public async cancelOrders(productId: string): Promise<void> {
        const request: IRequest = {
            endpoint: "orders",
            method: "DELETE"
        };

        let openOrders: Array<ICoinbaseOrder> = [];

        do {
            await this.request(request, CoinbaseCancel);
            openOrders = await this.getRecentOrders(productId, true);
        } while (openOrders.length !== 0);

    }

    public async getRecentOrders(productId: string, onlyOpen = false): Promise<Array<ICoinbaseOrder>> {
        const params = onlyOpen ? "" : "?status=all";
        const request: IRequest = {
            endpoint: `orders${params}`
        };

        const response = await this.request(request, CoinbaseOrders);
        return response.list;
    }

    public async getAccounts(): Promise<Array<ICoinbaseAccount>> {
        const request: IRequest = {
            endpoint: "accounts"
        };

        const response = await this.request(request, CoinbaseAccounts);
        return response.list;
    }

    public async getBook(productId: string): Promise<ICoinbaseBook> {
        const request: IRequest = {
            endpoint: `products/${productId}/book/`
        };

        return this.request(request, CoinbaseBook);
    }

    public async placeOrder(side: string, productId: string, price: PreciseNumber, size: PreciseNumber): Promise<ICoinbaseOrder> {
        const body = {
            type: "limit",
            side,
            product_id: productId,
            price: price.toString(),
            size: size.toString(),
            post_only: true
        };

        const request: IRequest = {
            endpoint: "orders",
            method: "POST",
            body: JSON.stringify(body)
        };

        return this.request(request, CoinbaseOrder);
    }

    public override async request<T>(req: IRequest, schema: Model<T>): Promise<T> {
        const timestamp = Math.floor(Date.now() / 1000);
        const method = req.method ?? "GET";
        const body = req.body ?? "";

        const message = Buffer.from(timestamp.toString() + method + req.endpoint + body, "utf8");
        const key = Buffer.from(this.secret, "base64");
        const signature = isomorphic.hmac(message, key).toString("base64");

        const originalHeaders = req.headers ?? { };
        req.headers = {
            ...originalHeaders,
            "CB-ACCESS-SIGN": signature,
            "CB-ACCESS-TIMESTAMP": timestamp.toString()
        };
        return super.request(req, schema);
    }
}
