/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />
/// <reference path="../typings/scanf/scanf.d.ts" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

namespace example.interaction
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;
	export import external = samchon.protocol.external;

	export class Branch extends protocol.Entity
	{
		private name: string;
		private longitude: number;
		private latitude: number;

		public constructor();
		public constructor(name: string, longitude: number, latitude: number);

		public constructor(name: string = "", longitude: number = 0, latitude: number = 0)
		{
			super();

			this.name = name;
			this.longitude = longitude;
			this.latitude = latitude;
		}

		public TAG(): string
		{
			return "branch";
		}
	}
}