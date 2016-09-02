/// <reference path="../../API.ts" />

/// <reference path="ParallelClientArrayMediator.ts" />

namespace samchon.protocol.parallel
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

		public createChild(xml: library.XML): ParallelSystem
		{
			return this.createExternalServer(xml);
		}
		protected abstract createExternalServer(xml: library.XML): IParallelServer;

		/* ---------------------------------------------------------
			METHOD OF CLIENT
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
				if ((this.at(i) as external.IExternalServer)["connect"] != undefined)
					(this.at(i) as external.ExternalServer).connect();
		}
	}
}