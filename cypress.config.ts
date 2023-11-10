import { defineConfig } from "cypress";

export default defineConfig({
    viewportWidth: 1000,
    viewportHeight: 660,
    component: {
        supportFile: false,
        devServer: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            framework: "@dream2023/cypress-ct-solid-js",
            bundler: "vite",
        },
    },
    e2e: {
        baseUrl: "http://localhost:8080",
        setupNodeEvents(_on, _config) {
            // implement node event listeners here
        },
    },
});
