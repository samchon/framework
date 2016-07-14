/// <reference path="../../API.ts" />

/// <reference path="../EntityCollection.ts" />

namespace samchon.protocol.external
{
	export abstract class ExternalSystem
		extends EntityArrayCollection<ExternalSystemRole>
		implements IProtocol
	{
		protected communicator: ICommunicator;
		
		protected name: string;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
			
			this.name = "";
			this.communicator = null;
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public key(): string
		{
			return this.name;
		}
		
		public getName(): string
		{
			return this.name;
		}

		/* ---------------------------------------------------------
			NETWORK & MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendData(invoke: Invoke): void
		{
			this.communicator.sendData(invoke);
		}
		public replyData(invoke: Invoke): void
		{
			invoke.apply(this);

			for (let i: number = 0; i < this.size(); i++)
				this.at(i).replyData(invoke);
		}

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		public TAG(): string
		{
			return "system";
		}
		public CHILD_TAG(): string
		{
			return "role";
		}
	}
}