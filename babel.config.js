module.exports = function(api) {
	api.cache(true);

	const isTest = process.env.NODE_ENV === "test";

	const presets = [
		["@babel/env", isTest ? {} : { modules: false, loose: true }],
	];
	const plugins = [
		[
			"@babel/plugin-transform-runtime",
			{
				absoluteRuntime: false,
				corejs: false,
				helpers: true,
				regenerator: true,
				useESModules: false,
			},
		],
	];

	return {
		presets,
		plugins,
	};
};
