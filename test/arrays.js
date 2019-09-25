import assert from "assert";
import { readFile } from "mz/fs";
import rco from "../index";

describe("rco(* -> yield [])", function() {
	it("should aggregate several promises", function() {
		return rco(function*() {
			var a = readFile("index.js", "utf8");
			var b = readFile("LICENSE", "utf8");
			var c = readFile("package.json", "utf8");

			var res = yield [a, b, c];
			assert.equal(3, res.length);
			console.log(res.length);
			assert(~res[0].indexOf("export"));
			assert(~res[1].indexOf("MIT"));
			assert(~res[2].indexOf("devDependencies"));
		});
	});

	it("should noop with no args", function() {
		return rco(function*() {
			var res = yield [];
			assert.equal(0, res.length);
		});
	});

	it("should support an array of generators", function() {
		return rco(function*() {
			var val = yield [
				(function*() {
					return 1;
				})(),
			];
			assert.deepEqual(val, [1]);
		});
	});
});
