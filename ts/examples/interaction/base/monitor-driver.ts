/// <reference path="../../typings/samchon-framework/samchon-framework.d.ts" />

import samchon = require("samchon-framework");

namespace monitor
{
	import library = samchon.library;
	import protocol = samchon.protocol;

	export interface ISystem extends protocol.IProtocol
	{
		// private uid: number;

		// private set_uid(val: number): void;
	}

	export class MonitorDriver implements protocol.IProtocol
	{
		private system: ISystem;
		private connector: protocol.ServerConnector;

		public constructor(system: ISystem)
		{
			this.system = system;
			this.connector = new protocol.ServerConnector(this);
			this.connector.connect("127.0.0.1", 37900);
		}

		public sendData(invoke: protocol.Invoke): void
		{
			this.connector.sendData(invoke);
		}
		public notifySendData(to: number, invoke: protocol.Invoke): void
		{
			if (this.system["uid"] == -1 || to == -1)
				return;

			this.sendData(new protocol.Invoke("notifySendData", to, invoke.getListener()));
		}

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