import assert from "assert";
import rco from "../index";

describe("rco.wrap(fn*)", function() {
	it("should pass context", function() {
		var ctx = {
			some: "thing",
		};

		return rco
			.wrap(function*() {
				assert.equal(ctx, this);
			})
			.call(ctx);
	});

	it("should pass arguments", function() {
		return rco.wrap(function*(a, b, c) {
			assert.deepEqual([1, 2, 3], [a, b, c]);
		})(1, 2, 3);
	});

	// it("should expose the underlying generator function", function() {
	// 	var wrapped = rco.wrap(function*(a, b, c) {});
	// 	var source = Object.toString.call(wrapped.__generatorFunction__);
	// 	assert(source.indexOf("function*") === 0);
	// });
});
