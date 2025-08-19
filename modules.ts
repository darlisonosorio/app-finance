import { loadEnv } from "vite";

process.env = {
  ...process.env,
  ...loadEnv(process.env.NODE_ENV || "development", process.cwd()),
};

export default {
  host: process.env.VITE_APP_URL || ""
};
