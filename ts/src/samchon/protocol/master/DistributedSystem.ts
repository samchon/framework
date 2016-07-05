/// <reference path="../../API.ts" />

/// <reference path="../ExternalSystem.ts" />
/// <reference path="../InvokeHistory.ts" />

namespace samchon.protocol.master
{
	export abstract class DistributedSystemArray
		extends ExternalSystemArray
	{
		private roles: std.HashMap<string, DistributedSystemRole>;

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
		
		protected abstract createExternalClient(driver: ClientDriver): DistributedSystem;
		public abstract createRole(xml: library.XML): DistributedSystemRole;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public at(index: number): DistributedSystem
		{
			return super.at(index) as DistributedSystem;
		}
		public get(key: any): DistributedSystem
		{
			return super.get(key) as DistributedSystem;
		}

		public hasRole(key: string): boolean
		{
			return this.roles.has(key);
		}
		public getRole(key: string): DistributedSystemRole
		{
			return this.roles.get(key);
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
	}
}

namespace samchon.protocol.master
{
	export abstract class DistributedSystem
		extends ExternalSystem
	{
		private systemArray: DistributedSystemArray;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: DistributedSystemArray)
		{
			super();
			this.systemArray = systemArray;
		}

		public createChild(xml: library.XML): DistributedSystemRole
		{
			return this.getSystemArray().createRole(xml);
		}

		public getSystemArray(): DistributedSystemArray
		{
			return this.systemArray;
		}
	}
}

namespace samchon.protocol.master
{
	export abstract class DistributedSystemRole 
		extends ExternalSystemRole
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