import node from "../src/node.js";
import web from "../src/node.js";

const input = Buffer.from("Hello this is a sample buffer");
const sampleKey = Buffer.from("Hello this is a sample key");
const expected = Buffer.from("53c43c2872df69a1d8cab81f4197270867787b64a18e77bfa8b870802b0f8053", "hex");

it("Should be able to hmac on Node", async () => {
    const result = await node.hmac(input, sampleKey);
    expect(result).toStrictEqual(expected);
});

it("Should be able to hmac on Web", async () => {
    const result = await web.hmac(input, sampleKey);
    expect(result).toStrictEqual(expected);
});
