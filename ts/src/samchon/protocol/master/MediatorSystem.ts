/// <reference path="../../API.ts" />

/// <reference path="../slave/SlaveSystem.ts" />

namespace samchon.protocol.master
{
	export abstract class MediatorSystem
		extends slave.SlaveSystem
	{
		private system_array: ParallelSystemArray;
		private progress_list: std.HashMap<number, InvokeHistory>;

		public constructor(systemArray: ParallelSystemArray)
		{
			super();

			this.system_array = systemArray;
			this.progress_list = new std.HashMap<number, InvokeHistory>();
		}

		public abstract start(): void;

		public notifyEnd(uid: number): void
		{
			if (this.progress_list.has(uid) == false)
				return;

			let history: InvokeHistory = this.progress_list.get(uid);
			
			this.sendData(history.toInvoke());

			this.progress_list.erase(uid);
		}
	}
}