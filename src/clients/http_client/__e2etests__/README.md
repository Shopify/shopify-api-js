# Running `fetch_from_server.js`

In one terminal, run the test response server:
```
yarn test_http_server
```

In another terminal, build and run the miniflare script
```
# build
yarn rollup -c src/clients/http_client/__e2etests__/rollup.fetch_from_server.config.js
# run
yarn miniflare -e src/clients/http_client/__e2etests__/.env --global E2ETESTS=1 --modules bundle/fetch_from_server.js
```

In a third terminal, trigger the test
```
curl http://localhost:8787
```

# Running `cf-test.js`
```
# build
yarn rollup -c src/clients/http_client/__e2etests__/experiments/rollup.cf-test.config.js
# run
yarn miniflare -e src/clients/http_client/__e2etests__/.env --modules bundle/cf-test.js
```

In another terminal, trigger the script
```
curl http://localhost:8787
```

# Running `miniflare.mjs`
```
yarn node src/clients/http_client/__e2etests__/experiments/miniflare.mjs
```

# Running `env_test.js`
```
# build
yarn rollup -c src/clients/http_client/__e2etests__/experiments/rollup.env_test.config.js
# run
yarn miniflare -e src/clients/http_client/__e2etests__/.env --global E2ETESTS=1 --modules bundle/env_test.js
# end with Ctrl-C
```
NB: without `--global E2ETESTS=1` will result in `Nope, not running network tests :(`
