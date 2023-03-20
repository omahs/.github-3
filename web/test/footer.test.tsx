import React from "react";
import renderer from "react-test-renderer";
import Footer from "../src/components/footer";

it("Footer should be displayed", () => {
    const component = renderer.create(<Footer />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});
