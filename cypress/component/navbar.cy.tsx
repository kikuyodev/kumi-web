import { mount } from "@dream2023/cypress-ct-solid-js";
import { Router } from "@solidjs/router";
import { Navbar } from "../../src/components/Navbar";

describe("Navbar component", () => {
    it("should render", () => {
        mount(<Router><Navbar /></Router>);
    });
});
