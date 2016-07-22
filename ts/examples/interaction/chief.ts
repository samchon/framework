/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />
/// <reference path="../typings/scanf/scanf.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");
import scanf = require("scanf");

import tsp = require("./base/tsp");
import pack = require("./base/packer");

namespace chief
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
		
		protected createChild(xml: library.XML): MasterSystem
		{
			return new MasterSystem(this);
		}
		
		/* ---------------------------------------------------------
			PROCEDURES -> SEND DATA & REPLY DATA
		--------------------------------------------------------- */
		public solveTSP(): void
		{
			let travel: tsp.Travel = new tsp.Travel();
			for (let i: number = 0; i < 5; i++)
				travel.push(new tsp.Branch((i+1) + "th branch", Math.random() * 90, Math.random() * 90));

			this.get("tsp").sendData(new protocol.Invoke("optimize", travel.toXML()));
		}
		
		public solvePack(): void
		{
			let productArray: pack.ProductArray = new pack.ProductArray();
			productArray.push
			(
				new pack.Product("Eraser", 500, 10, 70),
				new pack.Product("Pencil", 400, 30, 35),
				new pack.Product("Book", 8000, 150, 300),
				new pack.Product("Drink", 1000, 75, 250),
				new pack.Product("Umbrella", 4000, 200, 1000),
				new pack.Product("Notebook-PC", 800000, 150, 850),
				new pack.Product("Tablet-PC", 600000, 120, 450)
			);

			let packer: pack.Packer = new pack.Packer(productArray);
			packer.push
			(
				new pack.WrapperArray(new pack.Wrapper("Large", 100, 200, 1000)),
				new pack.WrapperArray(new pack.Wrapper("Medium", 70, 150, 500)),
				new pack.WrapperArray(new pack.Wrapper("Small", 50, 100, 250))
			);

			this.get("packer").sendData(new protocol.Invoke("optimize", packer.toXML()));
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
			console.log("Select what to do.");
			console.log("	1. Solve TSP");
			console.log("	2. Solve Packer");

			let what_to_do: number = scanf("%d");
			
			///////
			// CONSTRUCT CHIEF
			///////
			// CREATE CHIEF
			let chief: Chief = new Chief();
			{
				// ADD MASTER SYSTEMS WITH THEIR IP ADDRESSES.
				console.log("Insert IP addresses of external systems.");
	
				console.log("	TSP system: ");
				chief.push_back(new MasterSystem(chief, "tsp", "127.0.0.1", 37110));

				console.log("	Reporter system: ");
				chief.push_back(new MasterSystem(chief, "reporter", "127.0.0.1", 37200));

				console.log("	Packer system: ");
				chief.push_back(new MasterSystem(chief, "packer", "127.0.0.1", 37310));
			}
			chief.connect();

			setTimeout
			(
				function (): void
				{
					if (what_to_do == 1)
						chief.solveTSP();
					else
						chief.solvePack();
				}, 3000
			);
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

chief.Chief.main();