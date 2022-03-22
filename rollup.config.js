import swc from "rollup-plugin-swc";
import nodeResolve from "@rollup/plugin-node-resolve";
import cjs from "@rollup/plugin-commonjs";

export default {
	input: "cf-test.js",
	output: {
		dir: "bundle",
		format: "esm",
	},
	external: ["jsonwebtoken"],
	plugins: [
		nodeResolve({
			extensions: [".ts", ".js"],
			browser: true
		}),
		cjs(),
		swc({
			jsc: {
				parser: {
					syntax: "typescript",
				},
				target: "es2022"
			}
		})
	]
}