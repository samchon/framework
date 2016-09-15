/// <reference path="../../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../../typings/samchon-framework/samchon-framework.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");
import monitor = require("./monitor-driver");

namespace slave
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export abstract class Slave
		extends protocol.slave.SlaveClient
		implements monitor.ISystem, protocol.IEntity
	{
		private uid: number;
		private master_uid: number;
		private name: string;

		private monitor: monitor.MonitorDriver;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(name: string)
		{
			super();

			// INIT MEMBERS
			this.name = name;
			this.uid = -1;
			this.master_uid = -1;

			// CONNECT TO MONITOR
			this.monitor = new monitor.MonitorDriver(this);
		}

		public construct(xml: library.XML): void
		{
			protocol.IEntity.construct(this, xml);
		}

		protected createServerConnector(): protocol.IServerConnector
		{
			return new protocol.ServerConnector(this);
		}
		public createChild(xml: library.XML): protocol.external.ExternalSystemRole
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
			this.monitor.reportSendData(this.master_uid, invoke);
		}

		protected abstract optimize(xml: library.XML, index: number, size: number): void;

		public set_uid(val: number): void
		{
			// Called by Monitor::System::sendData()
			this.uid = val;

			let xml: library.XML = this.toXML();
			xml.clear();

			// NOTIFY MY UID TO MASTER
			// Call Master::SlaveSystem::construct()
			this.sendData(new protocol.Invoke("construct", xml));
		}

		private set_master_uid(val: number): void
		{
			// Called by Master::SlaveSystem::sendData()
			this.master_uid = val;
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		public key(): string
		{
			return this.name;
		}

		public TAG(): string
		{
			return "system";
		}

		public toXML(): library.XML
		{
			return protocol.IEntity.toXML(this);
		}
	}
}

export = slave;