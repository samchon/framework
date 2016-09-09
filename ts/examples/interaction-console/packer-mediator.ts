/// <reference path="../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/scanf/scanf.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");
import scanf = require("scanf");

import master = require("./base/master");
import pack = require("./base/packer");

namespace packer_mediator
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export class PackerMediator 
		extends protocol.parallel.ParallelClientArrayMediator
	{
		private master_ip: string;

		private best_packer: pack.Packer;
		private requested_size: number;
		private completed_count: number;

		public constructor(master_ip: string)
		{
			super();

			this.master_ip = master_ip;
		}

		protected createServerBase(): protocol.IServerBase
		{
			return new protocol.ServerBase(this);
		}
		protected createMediator(): protocol.parallel.MediatorSystem
		{
			return new protocol.parallel.MediatorClient(this, this.master_ip, 37300);
		}
		protected createExternalClient(driver: protocol.IClientDriver): protocol.parallel.ParallelSystem
		{
			console.log("A new slave has connected.");
			return new master.SlaveDriver(this);
		}

		public sendData(invoke: protocol.Invoke): void
		{
			if (invoke.getListener() == "optimize")
			{
				this.best_packer = null;
				this.requested_size = this.size();
				this.completed_count = 0;
			}

			super.sendData(invoke);
		}

		protected replyOptimization(xml: library.XML): void
		{
			let my_travel: pack.Packer = new pack.Packer();
			my_travel.construct(xml);

			console.log("A slave has finished his optimization: $" + my_travel.computePrice());

			// IF CURRENT TRAVEL IS SHORTER, MAKE IT THE BEST
			if (this.best_packer == null || my_travel.computePrice() < this.best_packer.computePrice())
			{
				console.log("The slave renewed the best solution");
				this.best_packer = my_travel;
			}

			// IF ALL TASKS ARE DONE, REPLY (REPORT) TO ITS MASTER
			if (++this.completed_count == this.requested_size)
			{
				console.log("An optimization has fully finished");
				this.getMediator().sendData(new protocol.Invoke("replyOptimization", this.best_packer.toXML()));
			}
		}

		public static main(): void
		{
			let master_ip: string;

			if (process.argv.length == 3)
				master_ip = process.argv[2];
			else
			{
				console.log("Master's IP address: ");
				master_ip = scanf("%s");
			}

			let mediator: PackerMediator = new PackerMediator(master_ip);
			mediator.open(37350);
		}
	}
}

new packer_mediator.PackerMediator.main();