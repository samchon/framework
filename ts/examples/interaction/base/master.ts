/// <reference path="../../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../../typings/samchon-framework/samchon-framework.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

namespace master
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export abstract class Master 
		extends protocol.master.ParallelClientArray
	{
		protected chiefDriver: ChiefDriver;

		public constructor(chief_port: number)
		{
			super();

			this.chiefDriver = new ChiefDriver(this);
			this.chiefDriver.open(chief_port);
		}

		protected createServerBase(): protocol.IServerBase
		{
			return new protocol.ServerBase(this);
		}
		protected createExternalClient(driver: protocol.IClientDriver): protocol.master.ParallelSystem
		{
			console.log("A new slave has connected.");
			return new SlaveDriver(this, driver);
		}

		protected abstract optimize(xml: library.XML): void;
		protected abstract replyOptimization(xml: library.XML): void;
	}

	export class ChiefDriver
		extends protocol.Server
		implements protocol.IProtocol
	{
		private master: Master;
		private communicator: protocol.IClientDriver;

		public constructor(master: Master)
		{
			super();

			this.master = master;
		}

		public open(port: number): void
		{
			super.open(port);
		}

		public addClient(communicator: protocol.IClientDriver): void
		{
			console.log("Chief has connected.");

			this.communicator = communicator;
			communicator.listen(this); // LISTENS ITSELF
		}

		public sendData(invoke: protocol.Invoke): void
		{
			this.communicator.sendData(invoke);
		}
		public replyData(invoke: protocol.Invoke): void
		{
			this.master.replyData(invoke);
		}
	}

	export class SlaveDriver
		extends protocol.master.ParallelSystem
	{
		public destructor(): void
		{
			console.log("A slave has left");
		}

		protected createChild(xml: library.XML): protocol.external.ExternalSystemRole
		{
			// DO NOT CREATE CHILDREN, EXTERNAL_SYSTEM_ROLE
			return null;
		}

		private replyOptimization(xml: library.XML): void
		{
			(this.getSystemArray() as Master)["replyOptimization"](xml);
		}
	}
}

export = master;