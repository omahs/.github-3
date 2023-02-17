
export class DateTime {
    private readonly timestamp: number;

    public constructor(timestamp?: number | string | Date) {
        if (timestamp == null) {
            const date = new Date();
            this.timestamp = Math.floor(date.getTime() / 1000);
        } else if (typeof timestamp === "number") {
            this.timestamp = timestamp;
        } else if (typeof timestamp === "string") {
            this.timestamp = parseInt(timestamp, 10);
        } else if (timestamp instanceof Date) {
            this.timestamp = timestamp.getTime() / 1000;
        } else {
            throw new Error("invalid input to DateTime constructor");
        }
    }

    public isNow(tolerance = 300): boolean {
        const now = new DateTime();
        if (this.timestamp < now.timestamp - tolerance) {
            return false;
        }
        if (this.timestamp > now.timestamp + tolerance) {
            return false;
        }
        return true;
    }

    public relativeTo(other = new DateTime()): string {
        const thisBegin = this.timestamp - this.timestamp % 8.64e4;
        const otherBegin = other.timestamp - other.timestamp % 8.64e4;
        const isAfter = thisBegin > otherBegin;
        const diff = Math.abs(thisBegin - otherBegin);
        const days = Math.floor(diff / 8.64e4);
        if (days === 0) { return "today"; }
        const denotion = days === 1 ? " day" : " days";
        const prefix = isAfter ? "in " : "";
        const suffix = isAfter ? "" : " ago";
        return `${prefix}${Math.abs(days)}${denotion}${suffix}`;
    }

    public addingSeconds(seconds: number): DateTime {
        return new DateTime(this.timestamp + seconds);
    }

    public addingMinutes(minutes: number): DateTime {
        return this.addingSeconds(minutes * 60);
    }

    public addingHours(hours: number): DateTime {
        return this.addingMinutes(hours * 60);
    }

    public addingDays(days: number): DateTime {
        return this.addingHours(days * 24);
    }

    public gt(other: DateTime): boolean {
        return this.timestamp > other.timestamp;
    }

    public gte(other: DateTime): boolean {
        return this.timestamp >= other.timestamp;
    }

    public lt(other: DateTime): boolean {
        return this.timestamp < other.timestamp;
    }

    public lte(other: DateTime): boolean {
        return this.timestamp <= other.timestamp;
    }

    public eq(other: DateTime): boolean {
        return this.timestamp === other.timestamp;
    }

    public valueOf(): number {
        return this.timestamp;
    }

    public toString(): string {
        return this.timestamp.toString();
    }

    public toJSON(): number {
        return this.timestamp;
    }
}

export const DateTimeSchema = {
    type: Number,
    get: (x?: string): DateTime | undefined => x == null ? undefined : new DateTime(x),
    set: (x: DateTime): number => x.valueOf()
};
