import { mount } from "@dream2023/cypress-ct-solid-js";
import { Modal } from "../../src/components/Modal";

describe("Modal component", () => {
    it("should render", () => {
        mount(<Modal
            title="Test"
        />);
    });
});
