/// <reference path="../../API.ts" />

/// <reference path="ExternalSystemArray.ts" />

namespace samchon.protocol.external
{
	export interface IExternalServerClientArray
		extends IExternalServerArray, IExternalClientArray
	{
	}

	export abstract class ExternalServerClientArray
		extends ExternalClientArray
		implements IExternalServerClientArray
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

		protected createChild(xml: library.XML): ExternalSystem
		{
			return this.createExternalServer(xml) as ExternalSystem;
		}
		protected abstract createExternalServer(xml: library.XML): IExternalServer;

		/* ---------------------------------------------------------
			METHOD OF CLIENT
		--------------------------------------------------------- */
		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
				if (this.at(i)["connect"] != undefined)
					(this.at(i) as IExternalServer).connect();
		}
	}
}