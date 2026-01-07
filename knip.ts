import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "next.config.{js,ts,mjs}",
    "src/app/**/*.{ts,tsx}"
  ],
  project: ["src/**/*.{ts,tsx}"],
  ignore: ["**/*.d.ts"],
  ignoreDependencies: ["eslint-config-next"],
  ignoreExportsUsedInFile: true
};

export default config;