
// const Miniflare = require('miniflare');
import { Miniflare } from "miniflare";

const mf = new Miniflare({
  buildCommand: "yarn e2etests:build:cf_worker", // Command to build project
  buildBasePath: "bundle", // Working directory for build command
  scriptPath: 'bundle/http_client-cf-worker.test.js',
  envPath: "src/clients/http_client/__e2etests__/.env.test",
  // scriptPath: 'src/clients/http_client/__e2etests__/http_client-cf-worker.test.js',
  // packagePath: 'src/clients/http_client/__e2etests__/package.e2etests.json',
  modules: true,
  modulesRules: [
    // Modules import rule
    { type: "CommonJS", include: ["**/*.js", "**/*.ts"], fallthrough: true },
    // { type: "ESModule", include: ["**/*.js", "**/*.ts"], fallthrough: true },
  ],
});
const res = await mf.dispatchFetch("http://localhost:8787/");
console.log(await res.text());
if (res.status !== 200) {
  process.exit(1);
} else {
  process.exit(0);
}
