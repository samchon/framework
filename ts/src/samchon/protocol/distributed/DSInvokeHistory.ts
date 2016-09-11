/// <reference path="../../API.ts" />

/// <reference path="../InvokeHistory.ts" />

namespace samchon.protocol.distributed
{
	export class DSInvokeHistory extends InvokeHistory
	{
		private system_: DistributedSystem;
		private role_: DistributedSystemRole;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from a DistributedSystem.
		 * 
		 * @param system
		 */
		public constructor(system: DistributedSystem);

		/**
		 * Initilizer Constructor.
		 * 
		 * @param system
		 * @param role
		 * @param invoke
		 */
		public constructor(system: DistributedSystem, role: DistributedSystemRole, invoke: Invoke);

		public constructor(system: DistributedSystem, role: DistributedSystemRole = null, invoke: Invoke = null)
		{
			super(invoke);

			this.system_ = system;
			this.role_ = role;
		}

		/**
		 * @inheritdoc
		 */
		public construct(xml: library.XML): void
		{
			super.construct(xml);

			if (xml.hasProperty("role") == false)
			{
				this.role_ = null;
				return;
			}

			let role_name: string = xml.getProperty("role");

			if (this.system_.has(role_name) == true)
				this.role_ = this.system_.get(role_name) as DistributedSystemRole;
			else
				this.role_ = null;
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getSystem(): DistributedSystem
		{
			return this.system_;
		}

		public getRole(): DistributedSystemRole
		{
			return this.role_;
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public toXML(): library.XML
		{
			let xml: library.XML = super.toXML();
			if (this.role_ != null)
				xml.setProperty("role", this.role_.getName());

			return xml;
		}
	}
}