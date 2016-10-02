/// <reference path="../../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../../typings/samchon-framework/samchon-framework.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");
import monitor = require("./monitor-driver");

namespace master
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export abstract class Master 
		extends protocol.parallel.ParallelClientArray
		implements monitor.ISystem
	{
		private uid: number;
		private name: string;
		
		protected chief: ChiefDriver;
		private monitor: monitor.MonitorDriver;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(name: string)
		{
			super();

			// INIT MEMBERS
			this.uid = -1;
			this.name = name;

			// CONSTRUCT CONNECTORS
			this.chief = new ChiefDriver(this);
			this.monitor = new monitor.MonitorDriver(this);
		}

		protected createServerBase(): protocol.IServerBase
		{
			return new protocol.ServerBase(this);
		}
		protected createExternalClient(driver: protocol.IClientDriver): protocol.parallel.ParallelSystem
		{
			console.log("A new slave has connected.");
			return new SlaveDriver(this, driver);
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN - REPLY_DATA
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

			// TO CHIEF
			let xml: library.XML = this.toXML();
			{
				xml.clear();
				xml.setTag("system");
			}
			this.chief.sendData(new protocol.Invoke("construct", xml));
		}

		protected abstract optimize(xml: library.XML): void;
		protected abstract replyOptimization(xml: library.XML): void;
	}

	export class SlaveDriver
		extends protocol.parallel.ParallelSystem
	{
		private uid: number;

		protected get master(): Master
		{
			return this.getSystemArray() as Master;
		}

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(master: protocol.parallel.ParallelSystemArray, driver: protocol.IClientDriver)
		{
			super(master, driver);

			this.uid = -1;
			if ((master as Master)["uid"] != -1)
				this.sendData(new protocol.Invoke("set_master_uid", (master as Master)["uid"]));
		}
		public destructor(): void
		{
			super.destructor();
			
			console.log("A slave has disconnected");

			if (this.uid != -1)
				this.master["monitor"].sendSystemStructure();
		}

		public construct(xml: library.XML): void
		{
			super.construct(xml);

			if (this.uid != -1)
				this.master["monitor"].sendSystemStructure();
		}
		public createChild(xml: library.XML): protocol.external.ExternalSystemRole
		{
			// DO NOT CREATE CHILDREN, EXTERNAL_SYSTEM_ROLE
			return null;
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendData(invoke: protocol.Invoke): void
		{
			super.sendData(invoke);

			// NOTIFY SEND_DATA
			this.master["monitor"].reportSendData(this.uid, invoke);
		}

		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
		}

		private replyOptimization(xml: library.XML): void
		{
			this.master["replyOptimization"](xml);
		}
	}

	export class ChiefDriver
		implements protocol.IProtocol
	{
		private master: Master;
		private connector: protocol.ServerConnector;

		private uid: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(master: Master)
		{
			this.master = master;
			this.uid = -1;

			this.connector = new protocol.ServerConnector(this);
			this.connector.connect("127.0.0.1", 37000);
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
			this.connector.sendData(invoke);

			// NOTIFY SEND_DATA
			console.log("report", this.uid);
			this.master["monitor"].reportSendData(this.uid, invoke);
		}
		
		public replyData(invoke: protocol.Invoke): void
		{
			if (invoke.apply(this) == false)
				this.master.replyData(invoke);
		}
	}
}

export = master;