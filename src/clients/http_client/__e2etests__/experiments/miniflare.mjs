// const Miniflare = require('miniflare');
import { Miniflare } from "miniflare";

const mf = new Miniflare({
  script: `
  addEventListener("fetch", (event) => {
    event.respondWith(new Response("Hello Miniflare!"));
  });
  `,
  // This doesn't work
  // script: `export default {
  //   async fetch(request, env, ctx) {
  //     return new Response("Hello Miniflare!");
  //   }
  // }`,
});
const res = await mf.dispatchFetch("http://localhost:8787/");
console.log(await res.text()); // Hello Miniflare!
