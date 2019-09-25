import babel from "rollup-plugin-babel";
import del from "rollup-plugin-delete";
import { terser } from "rollup-plugin-terser";

let isProd = process.env.NODE_ENV === "production";

const basePlugin = [
	babel({
		exclude: "node_modules/**",
		runtimeHelpers: true,
	}),
	del({ targets: "dist/*" }),
];

const devPlugin = [];
const prodPlugin = [terser()];
const plugins = basePlugin.concat(isProd ? prodPlugin : devPlugin);

export default {
	input: "./index.js",
	output: [
		{
			file: "dist/rco.js",
			format: "umd",
			name: "rco",
		},
		{
			file: "dist/rco.esm.js",
			format: "es",
		},
	],
	plugins,
	watch: {
		include: ["./index.js", "./utils.js"],
	},
};
