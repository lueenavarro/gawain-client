import ReactDOM from "react-dom";
import renderer from "react-test-renderer";

import Layout from "./Layout";

test("render without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Layout><div>Hello world!</div></Layout>, div);
})

test("snapshot matches", ()=> {
    const tree= renderer.create(<Layout><p>Hello world!</p><p>Hi There!</p></Layout>).toJSON();
    expect(tree).toMatchSnapshot();
})