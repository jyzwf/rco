import assert from "assert";
import rco from "../index";

function sleep(ms) {
	return function(done) {
		setTimeout(done, ms);
	};
}

function* work() {
	yield sleep(50);
	return "yay";
}

describe("rco(fn*)", function() {
	describe("with a generator function", function() {
		it("should wrap with rco()", function() {
			return rco(function*() {
				var a = yield work;
				var b = yield work;
				var c = yield work;

				assert("yay" == a);
				assert("yay" == b);
				assert("yay" == c);

				var res = yield [work, work, work];
				assert.deepEqual(["yay", "yay", "yay"], res);
			});
		});

		it("should catch errors", function() {
			return rco(function*() {
				yield function*() {
					throw new Error("boom");
				};
			}).then(
				function() {
					throw new Error("wtf");
				},
				function(err) {
					assert(err);
					assert(err.message == "boom");
				},
			);
		});
	});
});
