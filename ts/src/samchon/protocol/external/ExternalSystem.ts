/// <reference path="../../API.ts" />

/// <reference path="../EntityCollection.ts" />

namespace samchon.protocol.external
{
	/**
	 * <p> An external system driver. </p>
	 * 
	 * <p> The {@link ExternalSystem} class represents an external system, connected and interact with this system. 
	 * {@link ExternalSystem} takes full charge of network communication with external system have connected.
	 * Replied {@link Invoke messages} from the external system is shifted to and processed in, children elements of this
	 * class, {@link ExternalSystemRole} objects. </p>
	 * 
	 * <p> <a href="http://samchon.github.io/framework/api/ts/assets/images/design/protocol_external_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/api/ts/assets/images/design/protocol_external_system.png"
	 *		 style="max-width: 100%" /> 
	 * </a> </p>
	 * 
	 * <h4> Bridge & Proxy Pattern </h4>
	 * <p> The {@link ExternalSystem} class can be a <i>bridge</i> for <i>logical proxy</i>. In framework within user, 
	 * which {@link ExternalSystem external system} is connected with {@link ExternalSystemArray this system}, it's not
	 * important. Only interested in user's perspective is <i>which can be done</i>. </p>
	 *
	 * <p> By using the <i>logical proxy</i>, user dont't need to know which {@link ExternalSystemRole role} is belonged
	 * to which {@link ExternalSystem system}. Just access to a role directly from {@link ExternalSystemArray.getRole}.
	 * Sends and receives {@link Invoke} message via the {@link ExternalSystemRole role}. </p>
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
	 *	<li> Those strategy is called <i>Bridge Pattern</i> and <i>Proxy Pattern</i>. </li>
	 * </ul>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class ExternalSystem
		extends EntityDequeCollection<ExternalSystemRole>
		implements IProtocol
	{
		/**
		 * A network communicator with external system.
		 */
		protected get communicator(): ICommunicator
		{
			return this.communicator_;
		}

		/**
		 * The name represents external system have connected. 
		 */
		protected name: string;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor();

		/**
		 * Construct from an IClientDriver object.
		 * 
		 * @param driver
		 */
		public constructor(driver: IClientDriver);

		public constructor(communicator: ICommunicator = null)
		{
			super();
			
			this.name = "";
			this.communicator = communicator;
		}

		/**
		 * Default Destructor.
		 */
		public destructor(): void
		{
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Identifier of {@link ExternalSystem} is its {@link name}.
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

		/* ---------------------------------------------------------
			NETWORK & MESSAGE CHAIN
		--------------------------------------------------------- */
		public close(): void
		{
			this.communicator.close();
		}

		/**
		 * Send {@link Invoke} message to external system.
		 * 
		 * @param invoke An {@link Invoke} message to send.
		 */
		public sendData(invoke: Invoke): void
		{
			this.communicator.sendData(invoke);
		}
		
		/**
		 * Handle an {@Invoke} message have received.
		 * 
		 * @param invoke An {@link Invoke} message have received.
		 */
		public replyData(invoke: Invoke): void
		{
			invoke.apply(this);

			for (let i: number = 0; i < this.size(); i++)
				this.at(i).replyData(invoke);
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		/**
		 * Tag name of the {@link ExternalSytem} in {@link XML}.
		 *
		 * @return <i>system</i>.
		 */
		public TAG(): string
		{
			return "system";
		}

		/**
		 * Tag name of {@link ExternalSystemRole children elements} belonged to the {@link ExternalSytem} in {@link XML}.
		 * 
		 * @return <i>role</i>.
		 */
		public CHILD_TAG(): string
		{
			return "role";
		}

		/**
		 * @inheritdoc
		 */
		public toXML(): library.XML
		{
			let xml: library.XML = super.toXML();
			xml.erase("erasing_");

			return xml;
		}

		/* ---------------------------------------------------------
			HIDDEN MEMBERS AND SETTERS
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private communicator_: ICommunicator;

		/**
		 * @hidden
		 */
		private external_system_array_: ExternalSystemArray = null;

		// COLLECTION EVENT ON ARRAY AND DEQUE IS PRE-PROCESS
		// FLAG FOR EARSING IS REQUIRED TO ANTICIPATE INFINITE RECURSION
		/**
		 * @hidden
		 */
		private erasing_: boolean = false;

		/**
		 * @hidden
		 */
		private set external_system_array(system_array: ExternalSystemArray)
		{
			////////
			// SOME WEIRDO DEVELOPER CLOSES COMMUNICATOR ON CONSTRUCTION LEVEL
			// THUS, IT REQUIRES THOSE INSPECTIONS
			////////
			// IF THE CONNECTION WAS CLOSED BY USER IN CONSTRUCTION LEVEL
			if (this.erasing_ == true && this.external_system_array_ == null)
			{
				// ERASE THIS SYSTEM IMMEDIATELY
				std.remove(system_array.begin(), system_array.end(), this as ExternalSystem);
			}
			this.external_system_array_ = system_array;
		}

		/**
		 * A network communicator with external system.
		 */
		protected set communicator(val: ICommunicator)
		{
			// SET MEMBER
			this.communicator_ = val;
			if (this.communicator_ == null)
				return;

			// LISTEN DATA IF ~
			if ((this.communicator as IClientDriver).listen != undefined)
				(this.communicator as IClientDriver).listen(this);

			// HANDLE CLOSE
			this.communicator_.onClose = this.handle_close.bind(this);
		}

		/**
		 * @hidden
		 */
		private handle_close(): void
		{
			if (this.erasing_ == false && this.external_system_array_ != null)
				std.remove
				(
					this.external_system_array_.begin(), this.external_system_array_.end(),
					this as ExternalSystem
				);
		}
	}
}