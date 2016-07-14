/// <reference path="../../API.ts" />

/// <reference path="../external/ExternalSystem.ts" />

namespace samchon.protocol.slave
{
	export abstract class SlaveSystem
		extends external.ExternalSystem
	{
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
		}

		public replyData(invoke: Invoke): void
		{
			if (invoke.has("invoke_history_uid"))
			{
				// INIT HISTORY - WITH START TIME
				let history: InvokeHistory = new InvokeHistory(invoke);
				std.remove_if(invoke.begin(), invoke.end(),
					function (parameter: InvokeParameter): boolean
					{
						return parameter.getName() == "invoke_history_uid";
					}); // DETACH THE UID FOR FUNCTION AUTO-MATCHING

				// MAIN PROCESS - REPLY_DATA
				super.replyData(invoke);

				// NOTIFY - WITH END TIME
				history.notifyEnd();
				this.sendData(history.toInvoke());
			}
			else
				super.replyData(invoke);
		}
	}
}

namespace samchon.protocol.slave
{
	export interface ISlaveServerBase extends Server
	{
	}

	export class SlaveNormalServerBase 
		extends NormalServer 
		implements ISlaveServerBase
	{
		private slave_system: SlaveSystem;

		public constructor(slave_system: SlaveSystem)
		{
			super();

			this.slave_system = slave_system;
		}

		protected addClient(driver: IClientDriver): void
		{
			this.slave_system["communicator"] = driver;
			driver.listen(this.slave_system);
		}
	}

	export class SlaveWebServerBase
		extends WebServer
		implements ISlaveServerBase
	{
		private slave_system: SlaveSystem;

		public constructor(slave_system: SlaveSystem)
		{
			super();

			this.slave_system = slave_system;
		}

		protected addClient(driver: IClientDriver): void
		{
			this.slave_system["communicator"] = driver;
			driver.listen(this.slave_system);
		}
	}

	export class SlaveSharedWorkerServerBase 
		extends SharedWorkerServer 
		implements ISlaveServerBase
	{
		private slave_system: SlaveSystem;

		public constructor(slave_system: SlaveSystem)
		{
			super();

			this.slave_system = slave_system;
		}

		protected addClient(driver: IClientDriver): void
		{
			this.slave_system["communicator"] = driver;
			driver.listen(this.slave_system);
		}
	}
}