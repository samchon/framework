/// <reference path="../../API.ts" />

/// <reference path="../NormalCommunicator.ts" />
/// <reference path="../WebCommunicator.ts" />
/// <reference path="../SharedWorker.ts" />

namespace samchon.protocol.external
{
	export interface IExtServer extends Server
	{
	}

	export class ExtNormalServerBase
		extends NormalServer
		implements IExtServer
	{
		private system_array: ExternalSystemArray;

		public constructor(system_array: ExternalSystemArray)
		{
			super();
			this.system_array = system_array;
		}

		protected addClient(driver: IClientDriver): void
		{
			this.system_array["addClient"](driver);
		}
	}

	export class ExtWebServerBase
		extends WebServer
		implements IExtServer
	{
		private system_array: ExternalSystemArray;

		public constructor(system_array: ExternalSystemArray)
		{
			super();
			this.system_array = system_array;
		}

		protected addClient(driver: IClientDriver): void
		{
			this.system_array["addClient"](driver);
		}
	}

	export class ExtSharedWorkerServerBase
		extends SharedWorkerServer
		implements IExtServer
	{
		private system_array: ExternalSystemArray;

		public constructor(system_array: ExternalSystemArray)
		{
			super();
			this.system_array = system_array;
		}

		protected addClient(driver: IClientDriver): void
		{
			this.system_array["addClient"](driver);
		}
	}
}