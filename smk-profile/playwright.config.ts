import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  use: { baseURL: "http://localhost:4173", browserName: "chromium", channel: "chrome" },
  webServer: {
    command: "python3 -m http.server 4173 --directory out",
    url: "http://localhost:4173",
    reuseExistingServer: true,
  },
});
