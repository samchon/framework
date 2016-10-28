/// <reference types="samchon-framework" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");
import monitor = require("./monitor-driver");

import pack = require("./packer");
import tsp = require("./tsp");

/////////////////////////////////////////////////////////////////
// SYSTEM CLASSES
/////////////////////////////////////////////////////////////////
namespace parallel
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;
	
	export import external = samchon.templates.external;
	export import parallel = samchon.templates.parallel;

	export interface IMaster 
		extends parallel.ParallelSystemArray<SlaveDriver>
	{
		getParent(): protocol.IProtocol;
		getMonitor(): monitor.MonitorDriver;

		getPacker(): PackerProcess;
		getTSP(): TSPProcess;
	}

	export class SlaveDriver
		extends parallel.ParallelSystem
	{
		private uid: number;

		protected get master(): IMaster
		{
			return this.getSystemArray() as IMaster;
		}

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(master: IMaster, driver: protocol.IClientDriver)
		{
			super(master, driver);

			this.uid = -1;
			this.name = "";

			if (this.master["uid"] != -1)
				this.sendData(new protocol.Invoke("set_master_uid", master["uid"]));
		}
		public destructor(): void
		{
			super.destructor();
			
			console.log("A slave has disconnected");

			if (this.uid != -1)
				this.master.getMonitor().sendSystemStructure();
		}

		public construct(xml: library.XML): void
		{
			super.construct(xml);

			if (this.uid != -1)
				this.master.getMonitor().sendSystemStructure();
		}

		public createChild(xml: library.XML): external.ExternalSystemRole
		{
			return null;
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendData(invoke: protocol.Invoke): void
		{
			super.sendData(invoke);

			// NOTIFY SEND_DATA
			this.master.getMonitor().reportSendData(this.uid, invoke);
		}

		public replyData(invoke: protocol.Invoke): void
		{
			// MONITOR
			if (invoke.apply(this) == true)
				return;

			// REPLY OPTIMIZATION - FROM MEDIATOR OR SLAVE
			else if (invoke.getListener() == "replyPackerOptimization")
				this.master.getPacker().replyOptimization(invoke.front().getValue());
			else if (invoke.getListener() == "replyTSPOptimization")
				this.master.getTSP().replyOptimization(invoke.front().getValue());
			
			// ETC
			else
				super.replyData(invoke);
		}
	}
}

/////////////////////////////////////////////////////////////////
// PROCESS CLASSES
/////////////////////////////////////////////////////////////////
namespace parallel
{
	export class PackerProcess
	{
		private master: IMaster;

		private best_packer: pack.Packer;
		private requested_size: number;
		private completed_count: number;

		public constructor(master: IMaster)
		{
			this.master = master;
		}

		public init(size: number): void
		{
			this.best_packer = null;
			this.completed_count = 0;
			this.requested_size = size;
		}

		public optimize(xml: library.XML): void
		{
			let packer = new pack.Packer();
			packer.construct(xml);

			let invoke: protocol.Invoke = new protocol.Invoke("optimizePacker", packer.toXML());
			let piece_size: number = new library.CombinedPermutationGenerator(packer.size(), packer.getProductArray().size()).size();

			console.log("Start Packer optimization: #" + piece_size);
			this.init(this.master.sendSegmentData(invoke, piece_size));
		}

		public replyOptimization(xml: library.XML): void
		{
			let my_packer: pack.Packer = new pack.Packer();
			my_packer.construct(xml);

			console.log("A slave has finished his optimization: $" + my_packer.computePrice());

			// IF CURRENT TRAVEL IS SHORTER, MAKE IT THE BEST
			if (this.best_packer == null || this.best_packer.computePrice() == 0 || 
				my_packer.computePrice() < this.best_packer.computePrice())
			{
				console.log("The slave renewed the best solution");
				this.best_packer = my_packer;
			}

			// IF ALL TASKS ARE DONE, REPORT TO THE CHIEF
			if (++this.completed_count == this.requested_size)
			{
				//console.log("An optimization has fully completed. Performance index of each slave is: ");
				//for (let i: number = 0; i < this.master.size(); i++)
				//	console.log(library.StringUtil.substitute
				//	(
				//		"\t{1}. {2} -> {3}",
				//		i + 1, 
				//		this.master.at(i).getName(), 
				//		this.master.at(i).getPerformance()
				//	));

				this.master.getParent().sendData(new protocol.Invoke("replyPackerOptimization", this.best_packer.toXML()));
			}
		}
	}

	export class TSPProcess
	{
		private master: IMaster;

		private best_travel: tsp.Travel;
		private requested_size: number;
		private completed_count: number;

		public constructor(master: IMaster)
		{
			this.master = master;
		}

		public init(size: number): void
		{
			this.best_travel = null;
			this.completed_count = 0;
			this.requested_size = size;
		}

		public optimize(xml: library.XML): void
		{
			let travel = new tsp.Travel();
			travel.construct(xml);

			let invoke: protocol.Invoke = new protocol.Invoke("optimizeTSP", travel.toXML());
			let piece_size: number = new library.FactorialGenerator(travel.size()).size();

			console.log("Start TSP optimization: #" + piece_size);
			this.init(this.master.sendSegmentData(invoke, piece_size));
		}

		public replyOptimization(xml: library.XML): void
		{
			let my_travel: tsp.Travel = new tsp.Travel();
			my_travel.construct(xml);

			console.log("A slave has finished his optimization: " + my_travel.computeDistance()) + " km";

			// IF CURRENT TRAVEL IS SHORTER, MAKE IT THE BEST
			if (this.best_travel == null || this.best_travel.computeDistance() == 0 || my_travel.computeDistance() < this.best_travel.computeDistance())
			{
				console.log("The slave renewed the best solution");
				this.best_travel = my_travel;
			}

			// IF ALL TASKS ARE DONE, REPORT TO THE CHIEF
			if (++this.completed_count == this.requested_size)
			{
				console.log("An optimization has fully completed. Performance index of each slave is: ");
				for (let i: number = 0; i < this.master.size(); i++)
					console.log(library.StringUtil.substitute
					(
						"\t{1}. {2} -> {3}",
						i + 1, 
						this.master.at(i).getName(), 
						this.master.at(i).getPerformance()
					));

				this.master.getParent().sendData(new protocol.Invoke("replyTSPOptimization", this.best_travel.toXML()));
			}
		}
	}
}

export = parallel;