import { DateTime } from "./date.js";

export class Cached<Value> {
    private readonly ttl: number;
    private readonly cache = new Map<string, Value>();
    private readonly date = new Map<string, DateTime>();

    public constructor(initial?: Value, ttl = 60) {
        this.ttl = ttl;
        if (initial != null) {
            this.cache.set("default", initial);
        }
    }

    public set(value: Value, key = "default"): void {
        this.cache.set(key, value);
        this.date.set(key, new DateTime());
    }

    public get(key = "default"): Value | null {
        const date = this.date.get(key) ?? new DateTime(0);
        if (date.addingSeconds(this.ttl).lte(new DateTime())) { return null; }
        const object = this.cache.get(key);
        if (object == null) { return null; }
        return object;
    }

}
