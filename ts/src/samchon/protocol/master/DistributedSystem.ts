/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystem.ts" />

namespace samchon.protocol.master
{
	export abstract class DistributedSystem
		extends external.ExternalSystem
	{
		protected systemArray: DistributedSystemArray;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: DistributedSystemArray)
		{
			super();
			this.systemArray = systemArray;
		}

		public createChild(xml: library.XML): external.ExternalSystemRole
		{
			return this.systemArray["createRole"](xml);
		}

		public getSystemArray(): DistributedSystemArray
		{
			return this.systemArray;
		}
	}
}