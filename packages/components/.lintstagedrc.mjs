import baseConfig from "../../.lintstagedrc.mjs";

export default {
  ...baseConfig,
  "*.{html,css,vue,ts,tsx,js,jsx}": ["rslint --fix", "prettier --write"],
};
