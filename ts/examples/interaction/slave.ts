/// <reference types="node" />
/// <reference types="samchon-framework" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");
import monitor = require("./base/monitor-driver");

import pack = require("./base/packer");
import tsp = require("./base/tsp");

namespace slave
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;
	export import slave = samchon.templates.slave;

	export class SlaveSystem
		extends slave.SlaveClient
		implements monitor.ISystem, protocol.IEntity
	{
		private uid: number;
		private master_uid: number;
		private name: string;

		private monitor: monitor.MonitorDriver;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor()
		{
			super();

			// INIT MEMBERS
			this.name = "Slave";
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

		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendData(invoke: protocol.Invoke): void
		{
			super.sendData(invoke);

			// NOTIFY SEND_DATA
			this.monitor.reportSendData(this.master_uid, invoke);
		}

		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
		}

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

		private optimizePacker(xml: library.XML, first: number, last: number): void
		{
			console.log("A packing optimization command has received", first, last);

			// CONSTRUCT TRAVEL
			let packer: pack.Packer = new pack.Packer();
			packer.construct(xml);

			// OPTIMIZE
			packer.optimize(first, last);

			// REPORT TO ITS MASTER
			console.log("Report Packing optimization result: $" + packer.computePrice());
			this.sendData(new protocol.Invoke("replyPackerOptimization", packer.toXML()));
		}

		private optimizeTSP(xml: library.XML, first: number, last: number): void
		{
			console.log("A TSP optimization command has received");

			// CONSTRUCT TRAVEL
			let travel: tsp.Travel = new tsp.Travel();
			travel.construct(xml);

			// OPTIMIZE
			let scheduler: tsp.Scheduler = new tsp.Scheduler(travel);
			travel = scheduler.optimize(first, last);

			// REPORT TO ITS MASTER
			console.log("Report TSP optimization result: " + travel.computeDistance() + " km");
			this.sendData(new protocol.Invoke("replyTSPOptimization", travel.toXML()));
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

		/* ---------------------------------------------------------
			MAIN
		--------------------------------------------------------- */
		public static main(): void
		{
			let port: number = Number(process.argv[2]);

			let slave: SlaveSystem = new SlaveSystem();
			slave.connect("127.0.0.1", port);
		}
	}
}

slave.SlaveSystem.main();
