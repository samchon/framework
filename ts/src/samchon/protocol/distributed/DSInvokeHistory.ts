/// <reference path="../../API.ts" />

/// <reference path="../InvokeHistory.ts" />

namespace samchon.protocol.distributed
{
	/**
	 * History of an {@link Invoke} message.
	 * 
	 * The {@link PRInvokeHistory} is a class archiving history log of an {@link Invoke} message which requests the
	 * *distributed process*, created whenever {@link DistributedSystemRole.sendData} is called.
	 * 
	 * When the *distributed process* has completed, then {@link complete complete()} is called and the *elapsed time* is 
	 * determined. The elapsed time is utilized for computation of {@link DistributedSystem.getPerformance performance index}
	 * and {@link DistributedSystemRole.getResource resource index} of related objects.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_distributed_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_distributed_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @handbook [Protocol - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class DSInvokeHistory 
		extends InvokeHistory
	{
		/**
		 * @hidden
		 */
		private system_: DistributedSystem;
		
		/**
		 * @hidden
		 */
		private role_: DistributedSystemRole;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from a DistributedSystem.
		 * 
		 * @param system The {@link DistributedSystem} object who sent the {@link Invoke} message.
		 */
		public constructor(system: DistributedSystem);

		/**
		 * Initilizer Constructor.
		 * 
		 * @param system The {@link DistributedSystem} object who sent the {@link Invoke} message.
		 * @param role The {@link DistributedSystemRole} object who sent the {@link Invoke} message.
		 * @param invoke An {@link Invoke} message requesting the *distributed process*.
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
		/**
		 * Get the related {@link DistributedSystem} object.
		 */
		public getSystem(): DistributedSystem
		{
			return this.system_;
		}

		/**
		 * Get the related {@link DistributedSystemRole} object.
		 */
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