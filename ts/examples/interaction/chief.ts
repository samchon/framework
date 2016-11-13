/// <reference types="node" />
/// <reference types="samchon-framework" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");
import monitor = require("./base/monitor-driver");

import pack = require("./base/packer");
import tsp = require("./base/tsp");

namespace chief
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;
	export import distributed = samchon.templates.distributed;

	export class Chief
		extends distributed.DistributedClientArray<MasterSystem>
		implements monitor.ISystem
	{
		private uid: number;
		private name: string;

		private monitor: monitor.MonitorDriver;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor()
		{
			super();

			this.uid = -1;
			this.name = "Chief";

			this.insertProcess(new PackerProcess(this));
			this.insertProcess(new TSPProcess(this));

			this.monitor = new monitor.MonitorDriver(this);

			this.printMenu();
			process.stdin.on("data", this.handle_stdin.bind(this));
		}

		protected createServerBase(): protocol.IServerBase
		{
			return new protocol.ServerBase(this);
		}

		protected createProcess(xml: library.XML): distributed.DistributedProcess
		{
			if (xml.getProperty("name") == "packer")
				return new PackerProcess(this);
			else
				return new TSPProcess(this);
		}

		protected createExternalClient(driver: protocol.IClientDriver): MasterSystem
		{
			console.log("A master has connected");
			return new MasterSystem(this, driver);
		}

		/* ---------------------------------------------------------
			REQUEST
		--------------------------------------------------------- */
		public printMenu(): void
		{
			// process.stdout.write("\x1B[2J\x1B[0f"); // CLEAR CONSOLE

			console.log("Select what to do.");
			console.log("	1. Solve TSP");
			console.log("	2. Solve Packer");
		}

		private handle_stdin(input: Buffer): void
		{
			let no: number = Number(input.toString());
			if (no == 1)
				(this.getProcess("tsp") as TSPProcess).solve();
			else if (no == 2)
				(this.getProcess("packer") as PackerProcess).solve();
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

			// NOTIFY MY ID TO SLAVES (MASTER SYSTEMS)
			this.sendData(new protocol.Invoke("set_chief_uid", this.uid));
		}

		protected _Complete_history(history: samchon.templates.slave.InvokeHistory): boolean
		{
			let ret = super._Complete_history(history);

			console.log(this.toXML().toString());
			return ret;
		}

		/* ---------------------------------------------------------
			MAIN
		--------------------------------------------------------- */
		public static main(): void
		{
			let chief: Chief = new Chief();
			chief.open(37000);
		}
	}

	export class MasterSystem extends distributed.DistributedSystem
	{
		private uid: number;

		private get chief(): Chief
		{
			return this.getSystemArray() as Chief;
		}

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(chief: Chief, driver: protocol.IClientDriver)
		{
			super(chief, driver);

			this.uid = -1;
			if (chief["uid"] != -1)
				this.sendData(new protocol.Invoke("set_chief_uid", chief["uid"]));
		}
		public destructor(): void
		{
			super.destructor();

			if (this.uid != -1)
				this.chief["monitor"].sendSystemStructure();
		}

		public construct(xml: library.XML): void
		{
			super.construct(xml);

			if (this.uid != -1)
				this.chief["monitor"].sendSystemStructure();
		}

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendData(invoke: protocol.Invoke): void
		{
			super.sendData(invoke);

			this.chief["monitor"].reportSendData(this.uid, invoke);
		}

		public replyData(invoke: protocol.Invoke): void
		{
			if (invoke.apply(this) == false)
				super.replyData(invoke);
		}
	}

	export class PackerProcess extends distributed.DistributedProcess
	{
		public constructor(systemArray: Chief)
		{
			super(systemArray);
			this.name = "packer";
		}
		
		public solve(): void
		{
			let productArray: pack.ProductArray = new pack.ProductArray();
			productArray.push
			(
				new pack.Product("Eraser", 500, 10, 70),
				new pack.Product("Eraser", 500, 10, 70),
				new pack.Product("Pencil", 400, 30, 35),
				new pack.Product("Book", 8000, 150, 300),
				new pack.Product("Book", 8000, 150, 300),
				new pack.Product("Drink", 1000, 75, 250),
				new pack.Product("Drink", 1000, 75, 250),
				new pack.Product("Drink", 1000, 75, 250),
				new pack.Product("Umbrella", 4000, 200, 1000),
				new pack.Product("Notebook-PC", 800000, 150, 850),
				new pack.Product("Notebook-PC", 800000, 150, 850),
				new pack.Product("Tablet-PC", 600000, 120, 450),
				new pack.Product("Tablet-PC", 600000, 120, 450)
			);

			let packer: pack.Packer = new pack.Packer(productArray);
			packer.push
			(
				new pack.WrapperArray(new pack.Wrapper("Large", 100, 200, 1000)),
				new pack.WrapperArray(new pack.Wrapper("Medium", 70, 150, 500)),
				new pack.WrapperArray(new pack.Wrapper("Small", 50, 100, 250))
			);

			this.sendData(new protocol.Invoke("optimizePacker", packer.toXML()));
		}

		public replyData(invoke: protocol.Invoke): void
		{
			if (invoke.getListener() == "replyPackerOptimization")
				invoke.apply(this, this.printSolution);
		}
		protected printSolution(xml: library.XML): void
		{
			let packer: pack.Packer = new pack.Packer();
			packer.construct(xml);

			console.log("The best packing solution: $" + packer.computePrice());
			(this.getSystemArray() as Chief).printMenu();
		}
	}

	export class TSPProcess extends distributed.DistributedProcess
	{
		public constructor(systemArray: Chief)
		{
			super(systemArray);
			this.name = "tsp";
		}

		public solve(): void
		{
			let travel: tsp.Travel = new tsp.Travel();
			for (let i: number = 0; i < 9; i++)
				travel.push(new tsp.Branch((i + 1) + "th branch", Math.random() * 90, Math.random() * 90));

			this.sendData(new protocol.Invoke("optimizeTSP", travel.toXML()));
		}

		public replyData(invoke: protocol.Invoke): void
		{
			if (invoke.getListener() == "replyTSPOptimization")
				invoke.apply(this, this.printSolution);
		}
		protected printSolution(xml: library.XML): void
		{
			let travel: tsp.Travel = new tsp.Travel();
			travel.construct(xml);

			console.log("The best travel: " + travel.computeDistance() + " km");
			(this.getSystemArray() as Chief).printMenu();
		}
	}
}

chief.Chief.main();