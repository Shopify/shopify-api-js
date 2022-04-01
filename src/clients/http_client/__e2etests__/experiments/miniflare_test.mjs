// const Miniflare = require('miniflare');
import { Miniflare } from "miniflare";

const mf = new Miniflare({
  buildCommand: "yarn e2etests:build:cf_worker", // Command to build project
  scriptPath: 'bundle/http_client-cf-worker.test.js',
  envPath: "src/clients/http_client/__e2etests__/.env.test",
  modules: true,
});
const res = await mf.dispatchFetch("http://localhost:8787/");
console.log(await res.text());
if (res.status !== 200) {
  process.exit(1);
} else {
  process.exit(0);
}
