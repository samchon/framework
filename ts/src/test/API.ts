/// <reference path="../../lib/samchon.d.ts" />

eval('var std = require("tstl")');
eval('var samchon = require("../../lib/samchon")');

namespace example
{
	export import library = samchon.library;

	export function main(): void
	{
		console.log("TEST ALL");
		
		for (let key in example)
			if (key != "main" && (example as any)[key] instanceof Function)
			{
				console.log("===================================================");
				console.log("	" + key);
				console.log("===================================================");

				(example as any)[key]();
				console.log("\n");
			}
	}
}
module.exports = example;