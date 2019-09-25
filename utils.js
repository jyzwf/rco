export function isFunction(fn) {
	return typeof fn === "function";
}

function isAllFunction(fn) {
	const fns = Array.isArray(fn) ? fn : [fn];
	return fns.every(isFunction);
}

export function isPromise(p) {
	return isFunction(p.then);
}

export function isObject(val) {
	return val.constructor === Object;
}

// fn 为一个 generator 函数
export function isGeneratorFunction(fn) {
	const constructor = fn.constructor;
	if (!constructor) return false;
	if (
		fn.constructor.name === "GeneratorFunction" ||
		fn.constructor.displayName === "GeneratorFunction"
	) {
		return true;
	}

	return false;
}

// 处理 obj 是一个 generator 执行完之后的返回值
export function isGeneratorIterable(obj) {
	return isAllFunction([obj.next, obj.throw, obj.return]);
}

export function curryIdentify(val) {
	return () => val;
}

export function thunkable2Promise(fn) {
	return new Promise((resolve, reject) => {
		fn.call(this, function(err, ...args) {
			if (err) return reject(err);
			if (args.length > 1) resolve(args);
			resolve(args[0]);
		});
	});
}

export function awaitPromise(target, promises, key, results) {
	results[key] = undefined;
	let p = target
		.then((data) => {
			results[key] = data;
		})
		.catch((e) => {
			results[key] = e;
		});

	promises.push(p);
}
