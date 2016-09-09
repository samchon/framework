/// <reference path="../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

import master = require("./base/master");
import tsp = require("./base/tsp");

namespace tsp_master
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export class TSPMaster extends master.Master
	{
		private best_travel: tsp.Travel;
		private requested_size: number;
		private completed_count: number;

		public constructor()
		{
			super(37110);
			
			this.open(37100);
		}

		protected optimize(xml: library.XML): void
		{
			console.log("Start TSP optimization");

			let travel = new tsp.Travel();
			{
				travel.construct(xml);

				this.best_travel = travel;
				this.completed_count = 0;
				this.requested_size = this.size();
			}

			let invoke: protocol.Invoke = new protocol.Invoke("optimize", travel.toXML());
			let case_size: number = new library.FactorialGenerator(travel.size()).size();

			this.sendPieceData(invoke, case_size);
		}

		protected replyOptimization(xml: library.XML): void
		{
			console.log("A slave has finished his optimization");

			let my_travel: tsp.Travel = new tsp.Travel();
			my_travel.construct(xml);

			// IF CURRENT TRAVEL IS SHORTER, MAKE IT THE BEST
			if (my_travel.computeDistance() < this.best_travel.computeDistance())
			{
				console.log("The slave renewed the best solution");
				this.best_travel = my_travel;
			}

			// IF ALL TASKS ARE DONE, REPORT TO THE CHIEF
			if (++this.completed_count == this.requested_size)
			{
				console.log("An optimization has fully finished");
				this.chiefDriver.sendData(new protocol.Invoke("printTSP", this.best_travel.toXML()));
			}
		}
	}
}

new tsp_master.TSPMaster();