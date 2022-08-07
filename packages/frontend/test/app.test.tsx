import React from 'react';
import renderer from 'react-test-renderer';
import App from '../src/components/App';

it('App should be displayed', () => {
    const component = renderer.create(
      <App/>,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
});