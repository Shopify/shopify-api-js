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

# Running framework version of CF Worker tests
```
# build
yarn rollup -c src/clients/http_client/__e2etests__/experiments/framework/rollup.cf-worker.test.config.js
# run
yarn node src/clients/http_client/__e2etests__/experiments/framework/miniflare.e2e-runner.mjs
```
