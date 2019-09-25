import {
	isFunction,
	isPromise,
	isGeneratorFunction,
	isGeneratorIterable,
	curryIdentify,
	thunkable2Promise,
	awaitPromise,
	isObject,
} from "./utils";

function value2Promise(val) {
	if (!val) return val;
	if (isPromise(val)) return val;
	if (isGeneratorFunction(val)) return rco.call(this, val);
	if (isGeneratorIterable(val)) return rco.call(this, curryIdentify(val));
	if (isFunction(val)) return thunkable2Promise.call(this, val);
	if (Array.isArray(val)) return array2Promise.call(this, val);
	if (isObject(val)) return object2Promise.call(this, val);

	return val;
}

function array2Promise(arr) {
	return Promise.all(arr.map(value2Promise, this));
}

function object2Promise(obj) {
	return new Promise((resolve, reject) => {
		const results = new obj.constructor();
		const promises = [];
		Object.keys(obj).forEach((key) => {
			const target = obj[key];
			const promise = value2Promise.call(this, target);

			if (promise && isPromise(promise, promises)) {
				awaitPromise(promise, promises, key, results);
			} else {
				results[key] = promise;
			}
		});

		Promise.all(promises).then(() => resolve(results));
	}).catch((e) => {
		reject(e);
	});
}

function rco(fn, ...args) {
	return new Promise((resolve, reject) => {
		let step;
		if (isFunction(fn)) {
			step = fn.apply(this, args);
		}

		if (!step || !isGeneratorIterable(step)) return resolve(step);

		let next = step.next();

		function helper(done) {
			if (!done) {
				Promise.resolve(value2Promise.call(this, next.value))
					.then((data) => {
						try {
							next = step.next(data);
						} catch (e) {
							return reject(e);
						}

						helper(next.done);
					})
					.catch((e) => {
						try {
							next = step.throw(e);
						} catch (e) {
							return reject(e);
						}
						helper(next.done);
					});
			} else {
				resolve(next.value);
			}
		}
		helper(next.done);
	});
}

rco.wrap = function(fn) {
	return function(...args) {
		return rco.call(this, fn, ...args);
	};
};

export default rco;
