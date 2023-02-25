
/**
    Turn an urlencoded query/body into a js object. This naive method
    just splits the string on a comma or ampersant and parses each object
    separately and stores it in an object.
**/
export const queryToObject = (query: string): Record<string, string> => {
    return Object.fromEntries(query
        .split(/,|&/ug)
        .map((value): [string, string] => {
            const split = value.split("=");
            return [split[0], split[1]];
        })) as Record<string, string>;
};
