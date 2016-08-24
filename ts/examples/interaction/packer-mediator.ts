/// <reference path="../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

/// <reference path="../typings/node/node.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

import monitor = require("./base/monitor-driver");

import master = require("./base/master");
import pack = require("./base/packer");

namespace packer_mediator
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export class PackerMediator
		extends protocol.parallel.ParallelClientArrayMediator
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
		protected createMediator(): protocol.parallel.MediatorSystem
		{
			return new PackerMasterDriver(this, "127.0.0.1", 37200);
		}
		protected createExternalClient(driver: protocol.IClientDriver): protocol.parallel.ParallelSystem
		{
			console.log("A new slave has connected.");
			return new master.SlaveDriver(this, driver);
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		// SEND-DATA
		//--------
		public sendData(invoke: protocol.Invoke): void
		{
			if (invoke.getListener() == "optimize")
			{
				// INTERCEPT SEND_DATA FROM MASTER TO MY SLAVES
				this.best_packer = null;
				this.requested_size = this.size();
				this.completed_count = 0;
			}

			super.sendData(invoke);
		}

		//--------
		// REPLY-DATA
		//--------
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
			this.mediator.sendData(new protocol.Invoke("construct", xml));
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

		/* ---------------------------------------------------------
			MAIN
		--------------------------------------------------------- */
		public static main(): void
		{
			let mediator: PackerMediator = new PackerMediator();
			mediator.open(37250);
		}
	}

	export class PackerMasterDriver extends protocol.parallel.MediatorClient
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

			(this.getSystemArray() as PackerMediator)["monitor"].notifySendData(this.uid, invoke);
		}
		private set_master_uid(val: number): void
		{
			this.uid = val;
		}
	}
}

new packer_mediator.PackerMediator.main();