
/**
    A class for handling Dates and times. Underwater this
    class holds an unix seconds timestamp. This class
    can be constructed with either another timestamp (number
    or string) or a Date.
**/
export class DateTime {
    private readonly timestamp: number;

    public constructor(timestamp?: number | string | Date | DateTime) {
        if (timestamp == null) {
            const date = new Date();
            this.timestamp = Math.floor(date.getTime() / 1000);
        } else if (typeof timestamp === "number") {
            this.timestamp = timestamp;
        } else if (typeof timestamp === "string") {
            this.timestamp = parseInt(timestamp, 10);
        } else if (timestamp instanceof Date) {
            this.timestamp = timestamp.getTime() / 1000;
        } else if (timestamp instanceof DateTime) {
            this.timestamp = timestamp.timestamp;
        } else {
            throw new Error("invalid input to DateTime constructor");
        }
    }

    /**
        A method for determining if a specific DateTime is
        now. The tolerance parameter can be specified to
        increase or decrease the allowed deviation from the
        current time. This method returns true if `now - tolerance
        < this < now + tolerance` and returns false otherwise.
    **/
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

    /**
        Return a new DateTime object that is the current
        DateTime object plus the specified number of seconds.
    **/
    public addingSeconds(seconds: number): DateTime {
        return new DateTime(this.timestamp + seconds);
    }

    /**
        Return a new DateTime object that is the current
        DateTime object plus the specified number of minutes.
    **/
    public addingMinutes(minutes: number): DateTime {
        return this.addingSeconds(minutes * 60);
    }

    /**
        Return a new DateTime object that is the current
        DateTime object plus the specified number of hours.
    **/
    public addingHours(hours: number): DateTime {
        return this.addingMinutes(hours * 60);
    }

    /**
        Return a new DateTime object that is the current
        DateTime object plus the specified number of days.
    **/
    public addingDays(days: number): DateTime {
        return this.addingHours(days * 24);
    }

    /**
        Returns true if the other DateTime is after
        the current DateTime.
    **/
    public gt(other: DateTime): boolean {
        return this.timestamp > other.timestamp;
    }

    /**
        Returns true if the other DateTime is after
        or equal to the current DateTime.
    **/
    public gte(other: DateTime): boolean {
        return this.timestamp >= other.timestamp;
    }

    /**
        Returns true if the other DateTime is before
        the current DateTime.
    **/
    public lt(other: DateTime): boolean {
        return this.timestamp < other.timestamp;
    }

    /**
        Returns true if the other DateTime is before
        or equal to the current DateTime.
    **/
    public lte(other: DateTime): boolean {
        return this.timestamp <= other.timestamp;
    }

    /**
        Returns true if the other DateTime is equal
        to the current DateTime.
    **/
    public eq(other: DateTime): boolean {
        return this.timestamp === other.timestamp;
    }

    /**
        Turn this DateTime into its raw type (number)
        for storage.
    **/
    public valueOf(): number {
        return this.timestamp;
    }

    /**
        Turn this DateTime into a string.
    **/
    public toString(): string {
        return this.timestamp.toString();
    }

    /**
        Turn this DateTime into a json object.
    **/
    public toJSON(): number {
        return this.timestamp;
    }
}

/**
    A custom Mongoose validator that checks if the supplied datetime is a valid url.
**/
const validator = {
    validator: (date: DateTime): boolean => {
        try {
            const _ = new DateTime(date);
            return true;
        } catch {
            return false;
        }
    },
    message: (props: { value: string }): string => `${props.value} is not a valid url`
};

/**
    A custom Mongoose schema for the DateTime object. This schema can
    be use like `date: DateTimeSchema` or `date: { ...DateTimeSchema,
    otherProperties: true }`.
**/
export const DateTimeSchema = {
    type: Number,
    get: (x?: string): DateTime | undefined => x == null ? undefined : new DateTime(x),
    set: (x: DateTime): number => x.valueOf(),
    validate: validator
};
