import type { ICurrency, ICurrencyResponseItem, ICurrencyResponse } from "jewl-core";
import { Currency } from "jewl-core";
import { Get, Path, Route } from "tsoa";
import { HttpError } from "../../modules/error.js";

@Route("/v1/currency")
export class CurrencyController {

    private mapCurrency(currency: ICurrency): ICurrencyResponseItem {
        return { name: currency.name, coin: currency.coin, network: currency.network,
            networkName: currency.networkName, isDefault: currency.isDefault,
            requiresMemo: currency.requiresMemo, addressRegex: currency.addressRegex,
            memoRegex: currency.memoRegex, min: currency.min, max: currency.max,
            multiple: currency.multiple };
    }

    @Get("/all")
    public async getCurrencies(): Promise<ICurrencyResponse> {
        const currencies = await Currency.find().sort({ name: 1 });
        const response = currencies.map(this.mapCurrency.bind(this));
        return { currencies: response };
    }

    @Get("/{coin}")
    public async getCurrencyWithoutNetwork(@Path() coin: string): Promise<ICurrencyResponseItem> {
        const currency = await Currency.findOne({ coin, isDefault: true });
        if (currency == null) { throw new HttpError(404, `currency ${coin} not found`); }
        return this.mapCurrency(currency);
    }

    @Get("/{coin}/{network}")
    public async getCurrency(@Path() coin: string, @Path() network: string): Promise<ICurrencyResponseItem> {
        const currency = await Currency.findOne({ coin, network });
        if (currency == null) { throw new HttpError(404, `currency ${coin} on ${network} not found`); }
        return this.mapCurrency(currency);
    }

}


