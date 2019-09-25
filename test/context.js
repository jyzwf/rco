import assert from "assert";
import rco from "../index";

const ctx = {
	some: "thing",
};

describe("rco.call(this)", function() {
	it("should pass the context", function() {
		return rco.call(ctx, function*() {
			assert(ctx == this);
		});
	});
});
