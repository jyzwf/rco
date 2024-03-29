import assert from "assert";
import { readFile } from "mz/fs";
import rco from "../index";

describe("rco(* -> yield {})", function() {
	it("should aggregate several promises", function() {
		return rco(function*() {
			var a = readFile("index.js", "utf8");
			var b = readFile("LICENSE", "utf8");
			var c = readFile("package.json", "utf8");

			var res = yield {
				a: a,
				b: b,
				c: c,
			};

			assert.equal(3, Object.keys(res).length);
			assert(~res.a.indexOf("export"));
			assert(~res.b.indexOf("MIT"));
			assert(~res.c.indexOf("devDependencies"));
		});
	});

	it("should noop with no args", function() {
		return rco(function*() {
			var res = yield {};
			assert.equal(0, Object.keys(res).length);
		});
	});

	it("should ignore non-thunkable properties", function() {
		return rco(function*() {
			var foo = {
				name: { first: "tobi" },
				age: 2,
				address: readFile("index.js", "utf8"),
				tobi: new Pet("tobi"),
				now: new Date(),
				falsey: false,
				nully: null,
				undefiney: undefined,
			};

			var res = yield foo;

			assert.equal("tobi", res.name.first);
			assert.equal(2, res.age);
			assert.equal("tobi", res.tobi.name);
			assert.equal(foo.now, res.now);
			assert.equal(false, foo.falsey);
			assert.equal(null, foo.nully);
			assert.equal(undefined, foo.undefiney);
			assert(~res.address.indexOf("export"));
		});
	});

	it("should preserve key order", function() {
		function timedThunk(time) {
			return function(cb) {
				setTimeout(cb, time);
			};
		}

		return rco(function*() {
			var before = {
				sun: timedThunk(30),
				rain: timedThunk(20),
				moon: timedThunk(10),
			};

			var after = yield before;

			var orderBefore = Object.keys(before).join(",");
			var orderAfter = Object.keys(after).join(",");
			console.log(orderBefore, "\n", orderAfter);
			assert.equal(orderBefore, orderAfter);
		});
	});
});

function Pet(name) {
	this.name = name;
	this.something = function() {};
}
