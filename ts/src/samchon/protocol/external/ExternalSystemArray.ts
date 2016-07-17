/// <reference path="../../API.ts" />

/// <reference path="../EntityCollection.ts" />

namespace samchon.protocol.external
{
	export abstract class ExternalSystemArray
		extends EntityArrayCollection<ExternalSystem>
		implements IProtocol
	{
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

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public hasRole(key: string): boolean
		{
			for (let i: number = 0; i < this.size(); i++)
				for (let j: number = 0; j < this.at(i).size(); j++)
					if (this.at(i).at(j).key() == key)
						return true;

			return false;
		}

		public getRole(key: string): ExternalSystemRole
		{
			for (let i: number = 0; i < this.size(); i++)
				for (let j: number = 0; j < this.at(i).size(); j++)
					if (this.at(i).at(j).key() == key)
						return this.at(i).at(j);

			throw new std.OutOfRange("No role with such name.");
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendData(invoke: Invoke): void
		{
			for (let i: number = 0; i < this.size(); i++)
				this.at(i).sendData(invoke);
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
			return "systemArray";
		}
		public CHILD_TAG(): string
		{
			return "system";
		}
	}
}