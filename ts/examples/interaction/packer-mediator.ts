/// <reference types="samchon-framework" />

/// <reference types="node" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

import monitor = require("./base/monitor-driver");

import master = require("./base/master");
import pack = require("./base/packer");

namespace packer_mediator
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;
	export import templates = samchon.templates;

	export class PackerMediator
		extends templates.parallel.ParallelClientArrayMediator
		implements monitor.ISystem
	{
		private uid: number;
		private name: string;

		private monitor: monitor.MonitorDriver;

		private best_packer: pack.Packer;
		private requested_size: number;
		private completed_count: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor()
		{
			super();

			// INIT MEMBERS
			this.uid = -1;
			this.name = "Packer Mediator";

			// CONNECT TO MONITOR
			this.monitor = new monitor.MonitorDriver(this);
		}

		protected createServerBase(): protocol.IServerBase
		{
			return new protocol.ServerBase(this);
		}
		protected createMediator(): templates.parallel.MediatorSystem
		{
			return new PackerMasterDriver(this, "127.0.0.1", 37200);
		}
		protected createExternalClient(driver: protocol.IClientDriver): templates.parallel.ParallelSystem
		{
			console.log("A new slave has connected.");
			return new master.SlaveDriver(this, driver);
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		// SEND-DATA
		//--------
		public sendPieceData(invoke: protocol.Invoke, first: number, last: number): void
		{
			if (invoke.getListener() == "optimize")
			{
				console.log("Intercepted optimize message");

				this.best_packer = null;
				this.requested_size = this.size();
				this.completed_count = 0;
			}

			super.sendPieceData(invoke, first, last);
		}

		//--------
		// REPLY-DATA
		//--------
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
		}
		
		private set_uid(val: number): void
		{
			this.uid = val;

			// NOTIFY MY ID TO SLAVES
			this.sendData(new protocol.Invoke("set_master_uid", this.uid));

			// NOTIFY MY UID TO MASTER
			// Call Master::SlaveSystem::construct()
			let xml: library.XML = this.toXML();
			{
				xml.clear();
				xml.setTag("system");
			}
			this.getMediator().sendData(new protocol.Invoke("construct", xml));
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
				console.log("An optimization has fully completed. Performance index of each slave is: ");
				for (let i: number = 0; i < this.size(); i++)
					console.log(library.StringUtil.substitute("\t{1}. {2}", i + 1, this.at(i).getPerformance()));

				this.getMediator().sendData(new protocol.Invoke("replyOptimization", this.best_packer.toXML()));
			}
		}

		/* ---------------------------------------------------------
			MAIN
		--------------------------------------------------------- */
		public static main(): void
		{
			let mediator: PackerMediator = new PackerMediator();
			mediator.open(37250);
		}
	}

	export class PackerMasterDriver extends templates.parallel.MediatorClient
	{
		private uid: number;

		public constructor(systemArray: PackerMediator, ip: string, port: number)
		{
			super(systemArray, ip, port);
			
			this.uid = -1;
		}

		public sendData(invoke: protocol.Invoke): void
		{
			super.sendData(invoke);

			(this.getSystemArray() as PackerMediator)["monitor"].reportSendData(this.uid, invoke);
		}

		public replyData(invoke: protocol.Invoke): void
		{
			if (invoke.apply(this) == false)
				super.replyData(invoke);
		}

		private set_master_uid(val: number): void
		{
			this.uid = val;
		}
	}
}

new packer_mediator.PackerMediator.main();