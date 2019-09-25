import { readFile } from "mz/fs";
import assert from "assert";
import rco from "../index";

describe("rco() recursion", function() {
	it("should aggregate arrays within arrays", function() {
		return rco(function*() {
			var a = readFile("index.js", "utf8");
			var b = readFile("LICENSE", "utf8");
			var c = readFile("package.json", "utf8");

			var res = yield [a, [b, c]];
			assert.equal(2, res.length);
			assert(~res[0].indexOf("export"));
			assert.equal(2, res[1].length);
			assert(~res[1][0].indexOf("MIT"));
			assert(~res[1][1].indexOf("devDependencies"));
		});
	});

	it("should aggregate objects within objects", function() {
		return rco(function*() {
			var a = readFile("index.js", "utf8");
			var b = readFile("LICENSE", "utf8");
			var c = readFile("package.json", "utf8");

			var res = yield {
				0: a,
				1: {
					0: b,
					1: c,
				},
			};

			assert(~res[0].indexOf("export"));
			assert(~res[1][0].indexOf("MIT"));
			assert(~res[1][1].indexOf("devDependencies"));
		});
	});
});
