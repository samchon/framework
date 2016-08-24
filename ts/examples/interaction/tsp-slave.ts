/// <reference path="../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/scanf/scanf.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");
import scanf = require("scanf");

import slave = require("./base/slave");
import tsp = require("./base/tsp");

namespace tsp_slave
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export class TSPSlave extends slave.Slave
	{
		public constructor()
		{
			super("TSP Slave");
		}

		protected optimize(xml: library.XML, first: number, last: number): void
		{
			console.log("A TSP optimization command has received");

			//// SLEEP FOR A SECOND
			//let sleep: number = new Date().getTime() + Math.random() * 1000;
			//while (new Date().getTime() < sleep) { }
			
			// CONSTRUCT TRAVEL
			let travel: tsp.Travel = new tsp.Travel();
			travel.construct(xml);

			// OPTIMIZE
			let scheduler: tsp.Scheduler = new tsp.Scheduler(travel);
			travel = scheduler.optimize(first, last);

			// REPORT TO ITS MASTER
			console.log("Report TSP optimization result: " + travel.computeDistance() + " km");
			this.sendData(new protocol.Invoke("replyOptimization", travel.toXML()));			
		}

		public static main(): void
		{
			let slave: TSPSlave = new TSPSlave();
			slave.connect("127.0.0.1", 37100);
		}
	}
}

new tsp_slave.TSPSlave.main();