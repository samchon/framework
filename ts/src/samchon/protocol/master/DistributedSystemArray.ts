/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystemArray.ts" />

namespace samchon.protocol.master
{
	export abstract class DistributedSystemArray
		extends external.ExternalSystemArray
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
		
		protected abstract createExternalClient(driver: IClientDriver): DistributedSystem;
		protected abstract createExternalServer(xml: library.XML): IDistributedServer;

		protected abstract createRole(xml: library.XML): DistributedSystemRole;

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