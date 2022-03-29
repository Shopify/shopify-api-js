
// const Miniflare = require('miniflare');
import { Miniflare } from "miniflare";

const mf = new Miniflare({
  scriptPath: 'src/clients/http_client/__e2etests__/fetch_from_server.js',
  // packagePath: 'src/clients/http_client/__e2etests__/package.e2etests.json',
  modules: true, // Enable modules
  modulesRules: [
    // Modules import rule
    { type: "ESModule", include: ["**/*.js", "**/*.ts"], fallthrough: true },
  ],
});
const res = await mf.dispatchFetch("http://localhost:8787/");
console.log(await res.text());
