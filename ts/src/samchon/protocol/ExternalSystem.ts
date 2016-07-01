/// <reference path="../API.ts" />

/// <reference path="EntityCollection.ts" />

namespace samchon.protocol
{
	export abstract class ExternalSystemRole
		extends Entity
		implements IProtocol
	{
		private system: ExternalSystem;
		private name: string;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(system: ExternalSystem)
		{
			super();
			this.setSystem(system);
		}

		public setSystem(system: ExternalSystem): void
		{
			this.system = system;
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public key(): string
		{
			return this.name;
		}

		public getSystem(): ExternalSystem
		{
			return this.system;
		}
		public getName(): string
		{
			return this.name;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendData(invoke: Invoke): void
		{
			this.system.sendData(invoke);
		}
		public replyData(invoke: Invoke): void
		{
			invoke.apply(this);
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		public TAG(): string
		{
			return "role";
		}
	}
}