/// <reference types="node" />
/// <reference types="samchon-framework" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");
import monitor = require("./base/monitor-driver");

import base = require("./base/parallel");

namespace master
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export import templates = samchon.templates;
	export import parallel = samchon.templates.parallel;
	export import slave = samchon.templates.slave;

	export class Master 
		extends parallel.ParallelClientArray<base.SlaveDriver>
		implements base.IMaster, monitor.ISystem
	{
		private uid: number;
		private name: string;

		private chief: ChiefDriver;
		private monitor: monitor.MonitorDriver;

		private packer: base.PackerProcess;
		private tsp: base.TSPProcess;
		private p_invoke_queue: std.Queue<templates.slave.PInvoke>;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor()
		{
			super();
			
			this.uid = -1;
			this.name = "Master";

			this.chief = new ChiefDriver(this);
			this.monitor = new monitor.MonitorDriver(this);

			this.packer = new base.PackerProcess(this);
			this.tsp = new base.TSPProcess(this);
			this.p_invoke_queue = new std.Queue<templates.slave.PInvoke>();
		}

		protected createServerBase(): protocol.IServerBase
		{
			return new protocol.ServerBase(this);
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
			return this.chief;
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
			this.chief.sendData(new protocol.Invoke("construct", xml));
		}

		protected _Complete_history(history: templates.slave.InvokeHistory): boolean
		{
			let ret: boolean = super._Complete_history(history);

			if (ret == true && this.p_invoke_queue.empty() == false)
			{
				// COMPLETE A HISTORY AND POP IT.
				this.p_invoke_queue.front().complete();
				this.p_invoke_queue.pop();
			}
			return ret;
		}

		/* ---------------------------------------------------------
			MAIN
		--------------------------------------------------------- */
		public static main(): void
		{
			let port: number = Number(process.argv[2]);

			let master: Master = new Master();
			master.open(port);
		}
	}

	export class ChiefDriver
		extends samchon.templates.slave.SlaveClient
	{
		private master: Master;

		private uid: number;
		
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(master: Master)
		{
			super();

			this.master = master;
			this.uid = -1;

			this.connect("127.0.0.1", 37000);
		}

		protected createServerConnector(): protocol.IServerConnector
		{
			return new protocol.ServerConnector(this);
		}

		private set_chief_uid(val: number): void
		{
			this.uid = val;
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendData(invoke: protocol.Invoke): void
		{
			// NOTIFY SEND_DATA
			console.log("report", this.uid);
			this.master["monitor"].reportSendData(this.uid, invoke);

			super.sendData(invoke);
		}

		public replyData(invoke: protocol.Invoke): void
		{
			if (invoke.apply(this) == true)
				return;

			//----
			// OPTIMIZE - FROM CHIEF
			//----
			if (invoke instanceof templates.slave.PInvoke)
			{
				// HOLD COMPLETION
				invoke.hold();
				this.master["p_invoke_queue"].push(invoke);
			}

			if (invoke.getListener() == "optimizePacker")
				this.master.getPacker().optimize(invoke.front().getValue());
			else if (invoke.getListener() == "optimizeTSP")
				this.master.getTSP().optimize(invoke.front().getValue());

			// ETC
			else
				this.master.replyData(invoke);
		}
	}
}

master.Master.main();