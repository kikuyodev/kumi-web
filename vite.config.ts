import { config } from "dotenv";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

config();

export default defineConfig({
    envPrefix: "KUMI_",
    plugins: [solid()],
    server: {
        port: parseInt(process.env?.KUMI_PORT ?? "3000"),
    },
    define: {
        _ENV_: JSON.stringify(process.env.NODE_ENV),
        _DEV_: process.env.NODE_ENV !== "production"
    },
    build: {
        assetsDir: "assets"
    }
});
