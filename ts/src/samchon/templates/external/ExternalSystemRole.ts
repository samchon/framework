/// <reference path="../../API.ts" />

/// <reference path="../../protocol/Entity.ts" />

namespace samchon.templates.external
{
	/**
	 * A role of an external system.
	 * 
	 * The {@link ExternalSystemRole} class represents a role, *WHAT TO DO*. Extends the {@link ExternalSystemRole} class 
	 * and overrides {@link replyData replyData()} to define the *WHAT TO DO*. And assign this {@link ExternalSystemRole}
	 * object to related {@link ExternalSystem} object. 
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_external_system.png" 
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_external_system.png" 
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * #### Proxy Pattern
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
	 *		from {@link ExternalSystem} object, via {@link ExternalSystemArray.getRole ExternalSystemArray.getRole()}.
	 *	</li>
	 *	<li>
	 *		When you want to send an {@link Invoke} message to the belonged {@link ExternalSystem system}, just call
	 *		{@link ExternalSystemRole.sendData ExternalSystemRole.sendData()}. Then, the message will be sent to the
	 *		external system.
	 *	</li>
	 *	<li> Those strategy is called *Proxy Pattern*. </li>
	 * </ul>
	 *  
	 * @handbook [Templates - External System](https://github.com/samchon/framework/wiki/TypeScript-Templates-External_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ExternalSystemRole
		extends protocol.Entity
		implements protocol.IProtocol
	{
		/**
		 * @hidden
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
		 * Get grandparent {@link ExternalSystemArray}.
		 * 
		 * Get the grandparent {@link ExternalSystemArray} object through this parent {@link ExternalSystem}, 
		 * {@link ExternalSystem.getSystemArray ExternalSystem.getSystemArray()}.
		 * 
		 * @return The grandparent {@link ExternalSystemArray} object.
		 */
		public getSystemArray(): ExternalSystemArray
		{
			return this.system.getSystemArray();
		}

		/**
		 * Get parent {@link ExternalSystemRole} object.
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
		 * Send an {@link Invoke} message.
		 * 
		 * Sends an {@link Invoke} message to remote system through the parent {@link ExternalSystem} object.
		 * 
		 * @param invoke An {@link Invoke} message to send to the external system.
		 */
		public sendData(invoke: protocol.Invoke): void
		{
			this.system.sendData(invoke);
		}

		/**
		 * Handle replied {@link Invoke} message.
		 * 
		 * {@link ExternalSystemRole.replyData ExternalSystemRole.replyData()} is an abstract method handling a replied 
		 * {@link Invoke message} gotten from remote system via parent {@link ExternalSystem} object. Overrides this 
		 * method and defines the *WHAT TO DO* with the {@link Invoke message}.
		 * 
		 * @param invoke An {@link Invoke} message received from the {@link ExternalSystem external system}.
		 */
		public abstract replyData(invoke: protocol.Invoke): void;

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