/// <reference path="../../API.ts" />

/// <reference path="../Entity.ts" />

namespace samchon.protocol.external
{
	/**
	 * A role of an external system.
	 * 
	 * The {@link ExternalSystemRole} class represents a role, *what to do* in an {@link ExternalSystem}. 
	 * Extends this class and writes some methods related to the role.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png" 
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_external_system.png" 
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * <h4> Proxy Pattern </h4>
	 * The {@link ExternalSystemRole} class can be an *logical proxy*. In framework within user, which 
	 * {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not 
	 * important. Only interested in user's perspective is *which can be done*. 
	 * 
	 * By using the *logical proxy*, user dont't need to know which {@link ExternalSystemRole role} is belonged 
	 * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}. 
	 * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}.
	 * 
	 * <ul>
	 *	<li>
	 *		{@link ExternalSystemRole} can be accessed from {@link ExternalSystemArray} directly, without inteferring
	 *		from {@link ExternalSystem}, with {@link ExternalSystemArray.getRole}.
	 *	</li>
	 *	<li>
	 *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
	 *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
	 *		external system.
	 *	</li>
	 *	<li> Those strategy is called *Proxy Pattern*. </li>
	 * </ul>
	 *  
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ExternalSystemRole
		extends Entity
		implements IProtocol
	{
		/**
		 * An {@link ExternalSystem external system} containing this {@link ExternalSystemRole role}.
		 */
		private system: ExternalSystem;
		
		/**
		 * A name, represents and identifies this {@link ExternalSystemRole role}.
		 * 
		 * This {@link name} is an identifier represents this {@link ExternalSystemRole role}. This {@link name} is
		 * used in {@link ExternalSystemArray.getRole} and {@link ExternalSystem.get}, as a key elements. Thus, this
		 * {@link name} should be unique in an {@link ExternalSystemArray}.
		 */
		protected name: string;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Constructor from a system.
		 * 
		 * @param system An external system containing this role.
		 */
		public constructor(system: ExternalSystem)
		{
			super();
			this.system = system;
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Identifier of {@link ExternalSystemRole} is its {@link name}.
		 */
		public key(): string
		{
			return this.name;
		}

		/**
		 * Get external system, this role is belonged to.
		 */
		public getSystem(): ExternalSystem
		{
			return this.system;
		}

		/**
		 * Get name, who represents and identifies this role.
		 */
		public getName(): string
		{
			return this.name;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * Send an {@link Invoke} message to the external system via {@link system}.
		 * 
		 * @param invoke An {@link Invoke} message to send to the external system.
		 */
		public sendData(invoke: Invoke): void
		{
			this.system.sendData(invoke);
		}

		/**
		 * Handle replied {@link Invoke message} from the {@link system external system} belonged to.
		 * 
		 * This {@link replyData replyData()} will call a member method named following {@link Invoke.listener}. 
		 * in the *invoke*.
		 * 
		 * @param invoke An {@link Invoke} message received from the {@link system external system}.
		 */
		public replyData(invoke: Invoke): void
		{
			invoke.apply(this);
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		/**
		 * Tag name of the {@link ExternalSytemRole} in {@link XML}.
		 *
		 * @return *role*.
		 */
		public TAG(): string
		{
			return "role";
		}
	}
}