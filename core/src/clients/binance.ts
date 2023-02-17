import type { Model } from "mongoose";
import type { IRequest } from "../utility/client.js";
import { Client } from "../utility/client.js";
import { DateTime } from "../utility/date.js";
import isomorphic from "jewl-isomorphic";
import type { IBinanceAddress, IBinanceCoin, IBinanceSymbol } from "../entities/binance.js";
import { BinanceCoin, BinancePrice, BinanceAddress } from "../entities/binance.js";

export class BinanceClient extends Client {
    private readonly secret: string;
    public constructor(key: string, secret: string) {
        const staticHeaders = {
            "Content-Type": "application/json",
            "X-MBX-APIKEY": key
        };
        super("https://api.binance.com/", staticHeaders);
        this.secret = secret;
    }

    public async getCoins(): Promise<IBinanceCoin> {
        const request: IRequest = {
            endpoint: "sapi/v1/capital/config/getall"
        };
        return this.requestWithSignature(request, BinanceCoin);
    }

    public async getSymbols(): Promise<IBinanceSymbol> {
        const request: IRequest = {
            endpoint: "api/v3/ticker/price"
        };
        return this.request(request, BinancePrice);
    }

    public async getDepositAddress(coin: string, network: string): Promise<IBinanceAddress> {
        const query = new URLSearchParams({
            coin,
            network
        });
        const request: IRequest = {
            endpoint: "sapi/v1/capital/deposit/address",
            query: query.toString()
        };
        return this.requestWithSignature(request, BinanceAddress);
    }

    public async requestWithSignature<T>(req: IRequest, schema: Model<T>): Promise<T> {
        const timestamp = new DateTime().valueOf() * 1000;
        if (req.query == null) {
            req.query = `timestamp=${timestamp}`;
        } else {
            req.query = `${req.query}&timestamp=${timestamp}`;
        }
        const body = req.body ?? "";
        const preimage = Buffer.from(req.query + body, "utf8");
        const secret = Buffer.from(this.secret, "utf8");
        const signature = await isomorphic.hmac(preimage, secret);
        req.query = `${req.query}&signature=${signature.toString("hex")}`;
        return this.request(req, schema);
    }

}

