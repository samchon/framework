/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystemRole.ts" />

namespace samchon.protocol.master
{
	export abstract class DistributedSystemRole 
		extends external.ExternalSystemRole
	{
		private systems: std.Deque<DistributedSystem>;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor()
		{
			super(null);
		}

		public sendData(invoke: Invoke): void
		{
		}
	}
}