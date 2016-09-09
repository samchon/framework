/// <reference path="../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

import master = require("./base/master");
import pack = require("./base/packer");

namespace packer_master
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export class PackerMaster extends master.Master
	{
		private best_packer: pack.Packer;
		private requested_size: number;
		private completed_count: number;

		public constructor()
		{
			super(37310);
		}

		protected optimize(xml: library.XML): void
		{
			let packer = new pack.Packer();
			{
				packer.construct(xml);

				this.best_packer = packer;
				this.completed_count = 0;
				this.requested_size = this.size();
			}

			let invoke: protocol.Invoke = new protocol.Invoke("optimize", packer.toXML());
			let piece_size: number = new library.CombinedPermutationGenerator(packer.size(), packer.getProductArray().size()).size();
		
			console.log("Start Packer optimization: #" + piece_size);
			this.sendPieceData(invoke, piece_size);
		}

		protected replyOptimization(xml: library.XML): void
		{
			let my_travel: pack.Packer = new pack.Packer();
			my_travel.construct(xml);

			console.log("A slave has finished his optimization: $" + my_travel.computePrice());

			// IF CURRENT TRAVEL IS SHORTER, MAKE IT THE BEST
			if (this.best_packer.computePrice() == 0 || my_travel.computePrice() < this.best_packer.computePrice())
			{
				console.log("The slave renewed the best solution");
				this.best_packer = my_travel;
			}

			// IF ALL TASKS ARE DONE, REPORT TO THE CHIEF
			if (++this.completed_count == this.requested_size)
			{
				console.log("An optimization has fully finished");
				this.chiefDriver.sendData(new protocol.Invoke("printPacker", this.best_packer.toXML()));
			}
		}

		public static main(): void
		{
			let master = new PackerMaster();
			master.open(37300);
		}
	}
}

packer_master.PackerMaster.main();