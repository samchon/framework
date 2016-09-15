/// <reference path="../API.ts" />

namespace interaction.viewer
{
	export class SystemTree extends std.TreeMap<number, System>
	{
		private rootNode: System;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor()
		{
			super();

			this.rootNode = new System();
		}

		public construct(xml: library.XML): void
		{
			// CONSTRUCT SYSTEMS
			this.rootNode.construct(xml);
			
			// LINKS TO MAP
			this.clear();
			this.explore_children(this.rootNode);

			// COMPUTE COORDINATES
			this.rootNode._Compute_coordinates();
		}

		private explore_children(system: System): void
		{
			this.insert([system.getUID(), system]);

			for (let i: number = 0; i < system.size(); i++)
				this.explore_children(system.at(i));
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getRoot(): System
		{
			return this.rootNode;
		}
	}
}