/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />
/// <reference path="../typings/scanf/scanf.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

import master = require("./base/master");
import tsp = require("./base/tsp");
import pack = require("./base/packer");

namespace reporter
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export class Reporter extends master.ChiefDriver
	{
		public constructor()
		{
			super(null);
		}

		public replyData(invoke: protocol.Invoke): void
		{
			invoke.apply(this);
		}

		private reportTSP(xml: library.XML): void
		{
			let travel: tsp.Travel = new tsp.Travel();
			travel.construct(xml);

			console.log("The best travel: " + travel.computeDistance() + " km");
		}
		private reportPacker(xml: library.XML): void
		{
			let packer: pack.Packer = new pack.Packer();
			packer.construct(xml);

			console.log("The best packing solution: $" + packer.computePrice());
		}

		public static main(): void
		{
			let reporter = new Reporter();
			reporter.open(37200);
		}
	}
}

reporter.Reporter.main();