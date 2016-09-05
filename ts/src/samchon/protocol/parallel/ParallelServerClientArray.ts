/// <reference path="../../API.ts" />

/// <reference path="ParallelClientArray.ts" />

namespace samchon.protocol.parallel
{
	export abstract class ParallelServerClientArray
		extends ParallelClientArray
		implements external.IExternalServerClientArray
	{
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
		}

		public createChild(xml: library.XML): ParallelSystem
		{
			return this.createExternalServer(xml);
		}
		protected abstract createExternalServer(xml: library.XML): IParallelServer;

		/* ---------------------------------------------------------
			METHOD OF CLIENT
		--------------------------------------------------------- */
		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
			{
				let system: external.ExternalSystem = this.at(i);
				if ((system as external.IExternalServer).connect == undefined)
					continue;

				(system as external.IExternalServer).connect();
			}
		}
	}
}