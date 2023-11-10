declare module "*.scss";

interface ImportMetaEnv {
    KUMI_PORT: string;
    KUMI_API_URL: string;
}

interface ImportMeta {
    env: ImportMetaEnv;
}