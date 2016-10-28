/// <reference types="samchon-framework" />

import std = require("typescript-stl");
import samchon = require("samchon-framework");

module tsp
{
	export import library = samchon.library;
	export import protocol = samchon.protocol;

	export class Scheduler
	{
		private travel: Travel;

		public constructor(travel: Travel)
		{
			this.travel = travel;
		}

		public optimize(): Travel;
		public optimize(index: number, size: number): Travel;

		public optimize(first: number = -1, last: number = -1): Travel
		{
			let factorial: library.FactorialGenerator = new library.FactorialGenerator(this.travel.size());

			if (first == -1)
			{
				first = 0;
				last = factorial.size();
			}

			let best_travel: Travel = this.travel;

			for (let i: number = first; i < last; i++)
			{
				let my_travel: Travel = new Travel(this.travel.size(), null);
				let row: number[] = factorial.at(i);

				for (let j: number = 0; j < this.travel.size(); j++)
					my_travel.set(j, this.travel.at(row[j]));

				if (my_travel.computeDistance() < best_travel.computeDistance())
					best_travel = my_travel;
			}
			return best_travel;
		}

		public static main(): void
		{
			let travel: Travel = new Travel();
			for (let i: number = 0; i < 6; i++)
				travel.push(new Branch((i+1) + " th branch", Math.random() * 90, Math.random() * 90));

			let scheduler: Scheduler = new Scheduler(travel);
			travel = scheduler.optimize();

			for (let i: number = 0; i < 6; i++)
				console.log(travel.at(i));

			console.log(travel.computeDistance());
		}
	}

	export class Travel extends protocol.EntityArray<Branch>
	{
		public createChild(xml: library.XML): Branch
		{
			return new Branch();
		}

		public computeDistance(): number
		{
			let distance: number = 0;

			for (let i: number = 1; i < this.size(); i++)
				distance += this.at(i).computeDistance(this.at(i-1));

			return distance;
		}

		public TAG(): string
		{
			return "travel";
		}
		public CHILD_TAG(): string
		{
			return "branch";
		}
	}

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

		public computeDistance(obj: Branch): number
		{
			if (this.longitude == obj.longitude && this.latitude == obj.latitude)
				return 0;
			
			let latitude_radian1: number = this.degree_to_radian(this.latitude);
			let latitude_radian2: number = this.degree_to_radian(obj.latitude);
			let theta: number = this.longitude - obj.longitude;

			let val: number = Math.sin(latitude_radian1) * Math.sin(latitude_radian2);
			val += Math.cos(latitude_radian1) * Math.cos(latitude_radian2) * Math.cos(this.degree_to_radian(theta));

			val = Math.acos(val);
			val = this.radian_to_degree(val);
			val = val * 60 * 1.1515;
			val = val * 1.609344;

			return val;
		}

		private degree_to_radian(val: number): number
		{
			return val * Math.PI / 180.0;
		}
		private radian_to_degree(val: number): number
		{
			return val * 180.0 / Math.PI;
		}

		public TAG(): string
		{
			return "branch";
		}
	}
}

// tsp.Scheduler.main();
export = tsp;