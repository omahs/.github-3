import "../../src/utility/string.js";

it("Should parse a valid integer string", () => {
    const result = "12356".onlyNumber();
    const epected = "12356";
    expect(result).toStrictEqual(epected);
});

it("Should parse a valid float string", () => {
    const result = "1986.481".onlyNumber();
    const epected = "1986.481";
    expect(result).toStrictEqual(epected);
});

it("Should strip out invalid characters", () => {
    const result = "awe19%123gr56aw".onlyNumber();
    const epected = "1912356";
    expect(result).toStrictEqual(epected);
});

it("Should not strip out leading zeros", () => {
    const result = "018458".onlyNumber();
    const epected = "018458";
    expect(result).toStrictEqual(epected);
});

it("Should strip any second decimal separator", () => {
    const result = "0.184.58".onlyNumber();
    const epected = "0.18458";
    expect(result).toStrictEqual(epected);
});
