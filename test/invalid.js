import assert from "assert";
import rco from "../index";

describe("yield <invalid>", function() {
	it("should throw an error", function() {
		return rco(function*() {
			try {
				yield null;
				throw new Error("lol");
			} catch (err) {
				assert(err instanceof Error);
				assert(~err.message.indexOf("lol"));
			}
		});
	});
});
