/// <reference path="../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

/// <reference path="../typings/node/node.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

import slave = require("./base/slave");
import pack = require("./base/packer");

namespace tsp_slave
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export class PackerSlave extends slave.Slave
	{
		public constructor()
		{
			super("Packer Slave");
		}

		protected optimize(xml: library.XML, first: number, last: number): void
		{
			console.log("A packing optimization command has received");

			// CONSTRUCT TRAVEL
			let packer: pack.Packer = new pack.Packer();
			packer.construct(xml);

			// OPTIMIZE
			packer.optimize(first, last);

			// REPORT TO ITS MASTER
			console.log("Report Packing optimization result: $" + packer.computePrice());

			this.sendData(new protocol.Invoke("replyOptimization", packer.toXML()));
		}

		public static main(): void
		{
			let target: number;

			if (process.argv.length == 3)
				target = Number(process.argv[2]);
			else
				target = 1;

			let slave: PackerSlave = new PackerSlave();
			slave.connect("127.0.0.1", target == 2 ? 37250 : 37200);
		}
	}
}

new tsp_slave.PackerSlave.main();