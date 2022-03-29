import runningNetworkTests from '../../../../utils/network-tests';

if (runningNetworkTests()) {
	console.log("WE'RE RUNNING NETWORK TESTS!!!");
} else {
	console.log("Nope, not running network tests :(");
}

// if (typeof process !== 'undefined' && process !== 'undefined') {
// 	// process variable exists
// 	console.log('process is defined => NODE');
// 	console.log(`process.env.E2ETESTS = ${process.env.E2ETESTS}`);
// } else if (typeof globalThis !== 'undefined' && typeof globalThis.E2ETESTS !== 'undefined' && globalThis.E2ETESTS !== 'undefined') {
//   // not in node, therefore CF worker or miniflare
// 	console.log(`NOT node, E2ETESTS = ${globalThis.E2ETESTS}`);
// }
