/// <reference types="node" />
/// <reference types="samchon-framework" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");
import monitor = require("./base/monitor-driver");

import base = require("./base/parallel");

namespace mediator
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;
	export import parallel = samchon.templates.parallel;

	export class Mediator
		extends parallel.ParallelClientArrayMediator<base.SlaveDriver>
		implements base.IMaster, monitor.ISystem
	{
		private uid: number;
		private name: string;
		private master_port_: number;

		private monitor: monitor.MonitorDriver;

		private packer: base.PackerProcess;
		private tsp: base.TSPProcess;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(masterPort: number)
		{
			super();

			this.uid = -1;
			this.name = "Mediator";
			this.master_port_ = masterPort;

			this.monitor = new monitor.MonitorDriver(this);

			this.packer = new base.PackerProcess(this);
			this.tsp = new base.TSPProcess(this);
		}

		protected createServerBase(): protocol.IServerBase
		{
			return new protocol.ServerBase(this);
		}
		protected createMediator(): parallel.MediatorSystem
		{
			return new MasterDriver(this, this.master_port_);
		}

		protected createExternalClient(driver: protocol.IClientDriver): base.SlaveDriver
		{
			console.log("A new slave has connected.");
			return new base.SlaveDriver(this, driver);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getParent(): protocol.IProtocol
		{
			return this.getMediator();
		}
		public getMonitor(): monitor.MonitorDriver
		{
			return this.monitor;
		}

		public getPacker(): base.PackerProcess
		{
			return this.packer;
		}
		public getTSP(): base.TSPProcess
		{
			return this.tsp;
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendPieceData(invoke: protocol.Invoke, first: number, last: number): number
		{
			let ret: number = super.sendPieceData(invoke, first, last);

			if (invoke.getListener() == "optimizePacker")
				this.getPacker().init(ret);
			else if (invoke.getListener() == "optimizeTSP")
				this.getTSP().init(ret);

			return ret;
		}

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

		/* ---------------------------------------------------------
			MAIN
		--------------------------------------------------------- */
		public static main(): void
		{
			let master_port: number = Number(process.argv[2]);
			let my_port: number = Number(process.argv[3]);

			let mediator: Mediator = new Mediator(master_port);
			mediator.open(my_port);
		}
	}

	export class MasterDriver extends parallel.MediatorClient
	{
		private uid: number;

		public constructor(systemArray: Mediator, port: number)
		{
			super(systemArray, "127.0.0.1", port);

			this.uid = -1;
		}

		public sendData(invoke: protocol.Invoke): void
		{
			super.sendData(invoke);

			(this.getSystemArray() as Mediator).getMonitor().reportSendData(this.uid, invoke);
		}

		public replyData(invoke: protocol.Invoke): void
		{
			if (invoke.apply(this) == true)
				return;

			super.replyData(invoke);
		}

		private set_master_uid(val: number): void
		{
			this.uid = val;
		}
	}
}

mediator.Mediator.main();