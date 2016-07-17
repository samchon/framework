/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

namespace example.interaction
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;
	export import external = samchon.protocol.external;

	export class Chief extends external.ExternalSystemArray
	{
		public constructor()
		{
			super();

			this.push
			(
				new MasterSystem(this, "tsp"),
				new MasterSystem(this, "reporter"),
				new MasterSystem(this, "packer")
			);
		}

		protected createServer(): protocol.Server
		{
			return null;
		}
		protected createExternalServer(xml: library.XML): external.IExternalServer
		{
			return new MasterSystem(this);
		}
		protected createExternalClient(driver: protocol.IClientDriver): external.ExternalSystem
		{
			return null;
		}

		public replyData(invoke: protocol.Invoke): void
		{
			this.get("reporter").sendData(invoke);
		}
	}

	export class MasterSystem
		extends external.ExternalServer
	{
		private chief: Chief;

		public constructor(chief: Chief);
		public constructor(chief: Chief, name: string);

		public constructor(chief: Chief, name: string = "")
		{
			super();

			this.chief = chief;
			this.name = name;
		}

		protected createServerConnector(): protocol.IServerConnector
		{
			return new protocol.WebServerConnector(this);
		}
		protected createChild(xml: library.XML): external.ExternalSystemRole
		{
			return null;
		}

		public replyData(invoke: protocol.Invoke): void
		{
			this.chief.replyData(invoke);
		}
	}
}