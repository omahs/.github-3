import node from "../src/node.js";
import web from "../src/node.js";

const input = Buffer.from("Hello this is a sample buffer");
const expected = Buffer.from("9f3a309c40ec0b926bf307b796386a8088b5584568ce37436e71a1e7df6da85b", "hex");

it("Should be able to hash on Node", async () => {
    const result = await node.hash(input);
    expect(result).toStrictEqual(expected);
});

it("Should be able to hash on Web", async () => {
    const result = await web.hash(input);
    expect(result).toStrictEqual(expected);
});
