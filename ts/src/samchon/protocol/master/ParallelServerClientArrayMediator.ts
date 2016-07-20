/// <reference path="../../API.ts" />

/// <reference path="ParallelClientArrayMediator.ts" />

namespace samchon.protocol.master
{
	export abstract class ParallelServerClientArrayMediator
		extends ParallelClientArrayMediator
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

		protected createChild(xml: library.XML): ParallelSystem
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
				if (this.at(i)["connect"] != undefined)
					(this.at(i) as external.ExternalServer).connect();
		}
	}
}