const Express = require('express');
const Shopify = require('../dist/index-node');
const {convertRequest, convertResponse} = require('../dist/adapters/node-adapter');

const app = Express();
app.all("/mirror/*", async (req, res) => {
	const flatRequest = await convertRequest(req);
	res.json(flatRequest);
});

// If PORT is unset, the OS will choose a free port
const server = app.listen(process.env.PORT, () => {
	console.log(`Listening on localhost:${server.address().port}`);
});