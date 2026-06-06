/// <reference types="vite/client" />

type ImportMetaEnv = {
  readonly VITE_CLIENT_ID: string;
  readonly VITE_API_URL: string;
  readonly VITE_ENV: 'development' | 'production';
};

type ImportMeta = {
  readonly env: ImportMetaEnv;
};
