/// <reference path="../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/scanf/scanf.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");
import scanf = require("scanf");

import slave = require("./base/slave");
import pack = require("./base/packer");

namespace tsp_slave
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export class PackerSlave extends slave.Slave
	{
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
			let ip: string;
			let port: number;

			if (process.argv.length == 4)
				[ip, port] = [process.argv[2], Number(process.argv[3])];
			else
			{
				console.log("Master's IP address: ");
				ip = scanf("%s");

				console.log("Master's Port number (master: #37300, mediator: #37350): ");
				port = scanf("%d");
			}

			let slave: PackerSlave = new PackerSlave();
			slave.connect(ip, port);
		}
	}
}

new tsp_slave.PackerSlave.main();