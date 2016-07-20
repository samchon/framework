/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />
/// <reference path="../typings/scanf/scanf.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");
import scanf = require("scanf");

namespace example.interaction
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;
	export import external = samchon.protocol.external;

	export class Chief extends external.ExternalServerArray
	{
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor()
		{
			super();
		}
		
		protected createChild(xml: library.XML): external.IExternalServer
		{
			return new MasterSystem(this);
		}
		
		/* ---------------------------------------------------------
			PROCEDURES -> SEND DATA & REPLY DATA
		--------------------------------------------------------- */
		private solve_pack(): void
		{
		}

		private solve_tsp(): void
		{
		}
		
		public replyData(invoke: protocol.Invoke): void
		{
			this.get("reporter").sendData(invoke);
		}

		/* ---------------------------------------------------------
			START APPLICATION
		--------------------------------------------------------- */
		public static main(): void
		{
			///////
			// CONSTRUCT CHIEF
			///////
			// CREATE CHIEF
			let chief: Chief = new Chief();
			{
				// ADD MASTER SYSTEMS WITH THEIR IP ADDRESSES.
				console.log("Insert IP addresses of external systems.");
				console.log("	Reporter system: ");
				chief.push_back(new MasterSystem(chief, "reporter", scanf("%s"), 37200));

				console.log("	TSP system: ");
				chief.push_back(new MasterSystem(chief, "tsp", scanf("%s"), 37110));

				console.log("	Packer system: ");
				chief.push_back(new MasterSystem(chief, "packer", scanf("%s"), 37310));
			}
			chief.connect();

			///////
			// LISTEN ORDERS
			///////
		}
	}

	export class MasterSystem
		extends external.ExternalServer
	{
		private chief: Chief;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(chief: Chief, name: string = "", ip: string = "", port: number = 0)
		{
			super();

			this.chief = chief;
			this.name = name;
			this.ip = ip;
			this.port = port;
		}

		protected createServerConnector(): protocol.IServerConnector
		{
			return new protocol.WebServerConnector(this);
		}
		protected createChild(xml: library.XML): external.ExternalSystemRole
		{
			return null;
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		public replyData(invoke: protocol.Invoke): void
		{
			this.chief.replyData(invoke);
		}
	}
}