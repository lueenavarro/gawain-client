import ReactDOM from "react-dom";
import renderer from "react-test-renderer";

import Header from "./Header";

test("render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Header />, div);
});

test("snapshot matches", () => {
  const tree = renderer.create(<Header />).toJSON();
  expect(tree).toMatchSnapshot();
});
