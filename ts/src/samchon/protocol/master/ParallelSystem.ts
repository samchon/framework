/// <reference path="../../API.ts" />

/// <reference path="../ExternalSystem.ts" />
/// <reference path="../InvokeHistory.ts" />

namespace samchon.protocol.master
{
	export abstract class ParallelSystemArray 
		extends ExternalSystemArray
	{
		private history_sequence: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor()
		{
			super();

			this.history_sequence = 0;
		}

		protected abstract createExternalClient(driver: ClientDriver): IParallelClient;
		protected abstract createExternalServer(xml: library.XML): IParallelServer;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public at(index: number): ParallelSystem
		{
			return super.at(index) as ParallelSystem;
		}
		public get(key: any): ParallelSystem
		{
			return super.get(key) as ParallelSystem;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		public sendSegmentData(invoke: Invoke, size: number): void
		{
			this.sendPieceData(invoke, 0, size);
		}

		public sendPieceData(invoke: Invoke, index: number, size: number): void
		{
			invoke.push_back(new InvokeParameter("invoke_history_uid", ++this.history_sequence));

			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ParallelSystem = this.at(i);

				let piece_size: number = (i == this.size() - 1) 
					? size - index
					: Math.floor(size / this.size() * system.getPerformance());
				if (piece_size == 0)
					continue;

				system["send_piece_data"](invoke, index, piece_size);
				index += piece_size;
			}
		}

		private notify_end(history: PRInvokeHistory): void
		{
			let uid: number = history.getUID();

			// ALL THE SUB-TASKS ARE DONE?
			for (let i: number = 0; i < this.size(); i++)
				if (this.at(i)["progress_list"].has(uid) == false)
					return;

			///////
			// RE-CALCULATE PERFORMANCE INDEX
			///////
			// CONSTRUCT BASIC DATA
			let system_pairs = new std.Vector<std.Pair<ParallelSystem, number>>();
			let performance_index_avergae: number = 0.0;

			for (let i: number = 0; i < this.size(); i++)
			{
				let system: ParallelSystem = this.at(i);
				if (system["history_list"].has(uid) == false)
					continue;

				let my_history: PRInvokeHistory = system["history_list"].get(uid);
				let performance_index: number = my_history.getSize() / my_history.getElapsedTime();

				system_pairs.push_back(std.make_pair(system, performance_index));
				performance_index_avergae += performance_index;
			}
			performance_index_avergae /= system_pairs.size();

			// RE-CALCULATE PERFORMANCE INDEX
			for (let i: number = 0; i < system_pairs.size(); i++)
			{
				let system: ParallelSystem = system_pairs.at(i).first;
				let new_performance: number = system_pairs.at(i).second / performance_index_avergae;

				let ordinary_ratio: number = Math.max(0.3, 1.0 / (system["history_list"].size() - 1.0));
				system["performance"] = (system["performance"] * ordinary_ratio) + (new_performance * (1 - ordinary_ratio));
			}
			this.normalize_performance();
		}

		private normalize_performance(): void
		{
			// CALC AVERAGE
			let average: number = 0.0;

			for (let i: number = 0; i < this.size(); i++)
				average += this.at(i)["performance"];
			average /= this.size();

			// DIVIDE FROM THE AVERAGE
			for (let i: number = 0; i < this.size(); i++)
				this.at(i)["performance"] /= average;
		}
	}

	export abstract class ParallelSystem extends ExternalSystem
	{
		private systemArray: ParallelSystemArray;

		private progress_list: std.HashMap<number, PRInvokeHistory>;
		private history_list: std.HashMap<number, PRInvokeHistory>;

		private performance: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemArray: ParallelSystemArray)
		{
			super();

			this.systemArray = systemArray;
			this.performance = 1.0;

			this.progress_list = new std.HashMap<number, PRInvokeHistory>();
			this.history_list = new std.HashMap<number, PRInvokeHistory>();
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		public getSystemArray(): ParallelSystemArray
		{
			return this.systemArray;
		}

		public getPerformance(): number
		{
			return this.performance;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		private send_piece_data(invoke: Invoke, index: number, size: number): void
		{
			// DUPLICATE INVOKE AND ATTACH PIECE INFO
			let my_invoke: Invoke = new Invoke(invoke.getListener());
			{
				my_invoke.assign(invoke.begin(), invoke.end());
				my_invoke.push_back(new InvokeParameter("index", index));
				my_invoke.push_back(new InvokeParameter("size", size));
			}

			// REGISTER THE UID AS PROGRESS
			let history: PRInvokeHistory = new PRInvokeHistory(my_invoke);
			this.progress_list.insert([history.getUID(), history]);

			// SEND DATA
			this.sendData(invoke);
		}

		private report_invoke_history(xml: library.XML): void
		{
			///////
			// CONSTRUCT HISTORY
			///////
			let history: PRInvokeHistory = new PRInvokeHistory();
			history.construct(xml);

			let progress_it = this.progress_list.find(history.getUID());
			history["index"] = progress_it.second.getIndex();
			history["size"] = progress_it.second.getSize();

			// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
			this.progress_list.erase(progress_it);
			this.history_list.insert([history.getUID(), history]);

			// NOTIFY TO THE MANAGER, SYSTEM_ARRAY
			this.systemArray["notify_end"](history);
		}
	}

	export interface IParallelClient
		extends ParallelSystem, IExternalClient
	{
	}
	export interface IParallelServer
		extends ParallelSystem, IExternalServer
	{
	}

	export abstract class ParallelClient
		extends ParallelSystem
		implements IParallelClient
	{
	}

	export abstract class ParallelServer
		extends ParallelSystem
		implements IExternalServer
	{
		protected ip: string;
		protected port: number;

		public constructor(systemArray: ParallelSystemArray)
		{
			super(systemArray);

			this.ip = "";
			this.port = 0;
		}

		protected abstract createServerConnector(): ServerConnector;

		public connect(): void
		{
			if (this.communicator == null)
				return;

			this.communicator = this.createServerConnector();
			(this.communicator as ServerConnector).connect(this.ip, this.port);
		}

		public getIP(): string
		{
			return this.ip;
		}
		public getPort(): number
		{
			return this.port;
		}
	}
}

namespace samchon.protocol.master
{
	export class PRInvokeHistory extends InvokeHistory
	{
		private index: number;
		private size: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor();

		/**
		 * Construct from an Invoke message.
		 * 
		 * @param invoke
		 */
		public constructor(invoke: Invoke);

		public constructor(invoke: Invoke = null)
		{
			super(invoke);
			
			if (invoke == null)
			{
				this.index = 0;
				this.size = 0;
			}
			else
			{
				this.index = invoke.get("index").getValue() as number;
				this.size = invoke.get("size").getValue() as number;
			}
		}
		
		public getIndex(): number
		{
			return this.index;
		}

		public getSize(): number
		{
			return this.size;
		}
	}
}