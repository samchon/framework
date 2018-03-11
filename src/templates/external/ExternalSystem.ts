/// <reference path="../../API.ts" />

/// <reference path="../../protocol/entity/EntityCollection.ts" />

namespace samchon.templates.external
{
	/**
	 * An external system driver.
	 * 
	 * The {@link ExternalSystem} class represents an external system, connected and interact with this system. 
	 * {@link ExternalSystem} takes full charge of network communication with the remote, external system have connected.
	 * Replied {@link Invoke} messages from the external system is shifted to and processed in, children elements of this
	 * class, {@link ExternalSystemRole} objects.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_external_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_external_system.png"
	 *		 style="max-width: 100%" /> 
	 * </a>
	 * 
	 * #### Bridge & Proxy Pattern
	 * The {@link ExternalSystem} class can be a *bridge* for *logical proxy*. In framework within user, 
	 * which {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
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
	 *	<li> Those strategy is called *Bridge Pattern* and *Proxy Pattern*. </li>
	 * </ul>
	 * 
	 * @handbook [Templates - External System](https://github.com/samchon/framework/wiki/TypeScript-Templates-External_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ExternalSystem
		extends protocol.EntityDequeCollection<ExternalSystemRole>
		implements protocol.IProtocol
	{
		/**
		 * The name represents external system have connected. 
		 */
		protected name: string;

		// PARENT EXTERNAL_SYSTEM_ARRAY
		/**
		 * @hidden
		 */
		private system_array_: ExternalSystemArray<ExternalSystem>;

		// COMMUNICATOR, TAKES FULL CHARGE OF NETWORK COMMUNICATION
		/**
		 * @hidden
		 */
		private communicator_: protocol.ICommunicator;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from parent {@link ExternalSystemArray}.
		 * 
		 * @param systemArray The parent {@link ExternalSystemArray} object.
		 */
		public constructor(systemArray: ExternalSystemArray<ExternalSystem>);
		
		/**
		 * Constrct from parent {@link ExternalSystemArray} and communicator.
		 * 
		 * @param systemArray The parent {@link ExternalSystemArray} object.
		 * @param communicator Communicator with the remote, external system.
		 */
		public constructor(systemArray: ExternalSystemArray<ExternalSystem>, communicator: protocol.IClientDriver);

		public constructor(systemArray: ExternalSystemArray<ExternalSystem>, communicator: protocol.IClientDriver = null)
		{
			super();
			
			this.system_array_ = systemArray;
			this.communicator = communicator;

			if (communicator != null)
				communicator.listen(this);

			this.name = "";
		}

		/**
		 * Default Destructor.
		 * 
		 * This {@link destructor destructor()} method is called when the {@link ExternalSystem} object is destructed and
		 * the {@link ExternalSystem} object is destructed when connection with the remote system is closed or this 
		 * {@link ExternalSystem} object is {@link ExternalSystemArray.erase erased} from its parent 
		 * {@link ExternalSystemArray} object.
		 * 
		 * Note that, don't call this {@link destructor destructor()} method by yourself. It must be called automatically
		 * by those *destruction* cases. Also, if your derived {@link ExternalSystem} class has something to do on the
		 * *destruction*, then overrides this {@link destructor destructor()} method and defines the something to do.
		 * Overriding this {@link destructor destructor()}, don't forget to calling ```super.destructor();``` on tail.
		 *
		 * ```typescript
		 * class SomeSystem extends templates.external.ExternalSystem
		 * {
		 *     protected destructor(): void
		 *     {
		 *         // DO SOMETHING
		 *         this.do_something();
		 *
		 *         // CALL SUPER.DESTRUCTOR() ON TAIL. DON'T FORGET THIS
		 *         super.destructor();
		 *     }
		 * }
		 * ```
		 */
		protected destructor(): void
		{
			if (this.communicator != null && this.communicator.isConnected() == true)
			{
				this.communicator.onClose = null;
				this.communicator.close();
			}
		}

		/**
		 * @hidden
		 */
		private _Handle_close(): void
		{
			if (this.system_array_ == null)
				return;
			else
				this.system_array_.erase
				(
					std.remove(this.system_array_.begin(), this.system_array_.end(), this as ExternalSystem),
					this.system_array_.end()
				);
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Get parent {@link ExternalSystemArray} object.
		 */
		public getSystemArray(): ExternalSystemArray<ExternalSystem>;

		/**
		 * Get parent {@link ExternalSystemArray} object.
		 */
		public getSystemArray<SystemArray extends ExternalSystemArray<ExternalSystem>>(): SystemArray;

		public getSystemArray(): ExternalSystemArray<ExternalSystem>
		{
			return this.system_array_;
		}

		/**
		 * Identifier of {@link ExternalSystem} is its {@link name}.
		 * 
		 * @return name.
		 */
		public key(): string
		{
			return this.name;
		}

		/**
		 * Get {@link name}.
		 */
		public getName(): string
		{
			return this.name;
		}

		/**
		 * @hidden
		 */
		protected set communicator(val: protocol.ICommunicator)
		{
			this.communicator_ = val;

			if (this.communicator_ != null)
				this.communicator.onClose = this._Handle_close.bind(this);
		}

		/**
		 * @hidden
		 */
		protected get communicator(): protocol.ICommunicator
		{
			return this.communicator_;
		}

		/* ---------------------------------------------------------
			NETWORK & MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * Close connection.
		 */
		public close(): void
		{
			this.communicator.close();
		}

		/**
		 * Send {@link Invoke} message to external system.
		 * 
		 * @param invoke An {@link Invoke} message to send.
		 */
		public sendData(invoke: protocol.Invoke): void
		{
			this.communicator.sendData(invoke);
		}
		
		/**
		 * Handle an {@Invoke} message has received.
		 * 
		 * @param invoke An {@link Invoke} message have received.
		 */
		public replyData(invoke: protocol.Invoke): void
		{
			// SHIFT TO SYSTEM_ARRAY
			this.system_array_.replyData(invoke);

			// SHIFT TO ROLES
			for (let i: number = 0; i < this.size(); i++)
				this.at(i).replyData(invoke);
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		/**
		 * Tag name of the {@link ExternalSystem} in {@link XML}.
		 *
		 * @return *system*.
		 */
		public TAG(): string
		{
			return "system";
		}

		/**
		 * Tag name of {@link ExternalSystemRole children elements} belonged to the {@link ExternalSystem} in {@link XML}.
		 * 
		 * @return *role*.
		 */
		public CHILD_TAG(): string
		{
			return "role";
		}
	}
}