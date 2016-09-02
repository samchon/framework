/// <reference path="../../API.ts" />

/// <reference path="ParallelSystemArrayMediator.ts" />

namespace samchon.protocol.parallel
{
	export abstract class ParallelServerArrayMediator
		extends ParallelSystemArrayMediator
		implements external.IExternalServerArray
	{
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor()
		{
			super();
		}

		/* ---------------------------------------------------------
			CONNECTOR's METHOD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
				if ((this.at(i) as external.IExternalServer)["connect"] != undefined)
					(this.at(i) as external.IExternalServer).connect();

			this.start_mediator();
		}
	}
}