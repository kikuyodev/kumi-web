declare module "*.scss";

interface ImportMetaEnv {
    KUMI_PORT: string;
    KUMI_API_URL: string;
    DEV: boolean;
}

interface ImportMeta {
    env: ImportMetaEnv;
}