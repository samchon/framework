/// <reference path="../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");
import scanf = require("scanf");

import master = require("./base/master");
import pack = require("./base/packer");

namespace packer_mediator
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export class PackerMediator extends protocol.master.ParallelClientArrayMediator
	{
		private master_ip: string;

		private best_packer: pack.Packer;
		private requested_size: number;
		private completed_count: number;

		public constructor(masterIP: string)
		{
			super();

			this.master_ip = masterIP;
		}

		protected createServerBase(): protocol.IServerBase
		{
			return new protocol.WebServerBase(this);
		}
		protected createMediator(): protocol.master.MediatorSystem
		{
			return new protocol.master.MediatorWebClient(this, this.master_ip, 37300);
		}
		protected createExternalClient(driver: protocol.WebClientDriver): protocol.master.ParallelSystem
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
				this.mediator.sendData(new protocol.Invoke("replyOptimization", this.best_packer.toXML()));
			}
		}

		public static main(): void
		{
			console.log("Master's IP address: ");
			let ip: string = scanf("%s");

			let mediator = new PackerMediator(ip);
			mediator.open(37350);
		}
	}
}

packer_mediator.PackerMediator.main();