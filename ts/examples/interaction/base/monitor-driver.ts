/// <reference types="samchon-framework" />

import samchon = require("samchon-framework");

namespace monitor
{
	import library = samchon.library;
	import protocol = samchon.protocol;
	import templates = samchon.templates;

	export interface ISystem extends protocol.IProtocol, protocol.IEntity
	{
		// private uid: number;

		// private set_uid(val: number): void;
	}

	export class MonitorDriver implements protocol.IProtocol
	{
		private system: ISystem;
		private connector: protocol.ServerConnector;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(system: ISystem)
		{
			this.system = system;

			this.connector = new protocol.ServerConnector(this);
			this.connector.connect("127.0.0.1", 37900);
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		//--------
		// SEND_DATA
		//--------
		public sendData(invoke: protocol.Invoke): void
		{
			this.connector.sendData(invoke);
		}

		public reportSendData(to: number, invoke: protocol.Invoke): void
		{
			if (this.system["uid"] == -1 || to == -1)
				return;

			this.sendData(new protocol.Invoke("reportSendData", to, invoke.getListener()));
		}

		public sendSystemStructure(): void
		{
			if (this.system["uid"] == -1)
				return;

			let xml: library.XML = this.system.toXML();

			if (this.system instanceof templates.external.ExternalSystemArray)
			{
				for (let i: number = 0; i < this.system.size(); i++)
					if (this.system.at(i)["uid"] == -1)
						return;

				xml.setTag("system");
			}
			this.sendData(new protocol.Invoke("construct", xml));
		}

		//--------
		// REPLY_DATA
		//--------
		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
		}

		private set_uid(val: number): void
		{
			this.system["set_uid"](val);
		}
	}
}

export = monitor;