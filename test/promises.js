import assert from "assert";
import rco from "../index";

function getPromise(val, err) {
	return new Promise(function(resolve, reject) {
		if (err) reject(err);
		else resolve(val);
	});
}

describe("rco(* -> yield <promise>", function() {
	describe("with one promise yield", function() {
		it("should work", function() {
			return rco(function*() {
				var a = yield getPromise(1);
				assert.equal(1, a);
			});
		});
	});

	describe("with several promise yields", function() {
		it("should work", function() {
			return rco(function*() {
				var a = yield getPromise(1);
				var b = yield getPromise(2);
				var c = yield getPromise(3);

				assert.deepEqual([1, 2, 3], [a, b, c]);
			});
		});
	});

	describe("when a promise is rejected", function() {
		it("should throw and resume", function() {
			var error;

			return rco(function*() {
				try {
					yield getPromise(1, new Error("boom"));
				} catch (err) {
					error = err;
				}

				console.log(error.message);
				// assert("boom" == error.message);
				var ret = yield getPromise(1);
				// assert(1 == ret);
			});
		});
	});

	describe("when yielding a non-standard promise-like", function() {
		it("should return a real Promise", function() {
			assert(
				rco(function*() {
					yield { then: function() {} };
				}) instanceof Promise,
			);
		});
	});
});

describe("rco(function) -> promise", function() {
	it("return value", function(done) {
		rco(function() {
			return 1;
		}).then(function(data) {
			assert.equal(data, 1);
			done();
		});
	});

	it("return resolve promise", function() {
		return rco(function() {
			return Promise.resolve(1);
		}).then(function(data) {
			assert.equal(data, 1);
		});
	});

	it("return reject promise", function() {
		return rco(function() {
			return Promise.reject(1);
		}).catch(function(data) {
			assert.equal(data, 1);
		});
	});

	it("should catch errors", function() {
		return rco(function() {
			throw new Error("boom");
		})
			.then(function() {
				throw new Error("nope");
			})
			.catch(function(err) {
				assert.equal(err.message, "boom");
			});
	});
});
