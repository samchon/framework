/// <reference path="../../API.ts" />

/// <reference path="../slave/SlaveSystem.ts" />

namespace samchon.templates.parallel
{
	/**
	 * A mediator, the master driver.
	 * 
	 * The {@link MediatorSystem} is an abstract class helping {@link ParallelSystemArrayMediator} can be a **slave** 
	 * system. The {@link MediatorSystem} interacts and communicates with the **master** system as a role of **slave**.
	 * 
	 * This {@link MediatorSystem} object is created in {@link ParallelSystemArrayMediator.createMediator}. Override the
	 * method and return one of them, which are derived from this {@link MediatorSystem} class, considering which  
	 * type and protocol the **master** system follows:
	 * 
	 * - A client slave connecting to master server:
	 *   - {@link MediatorClient}
	 *   - {@link MediatorWebClient}
	 *   - {@link MediatorSharedWorkerClient}
	 * - A server slave accepting master client:
	 *   - {@link MediatorServer}
	 *   - {@link MediatorWebServer}
	 *   - {@link MediatorSharedWorkerServer}
	 * 
	 * When the **master** orders a *parallel process* to this **slave**, then the {@link MediatorSystem} delivers the 
	 * *parallel process* to its parent {@link ParallelSystemArrayMediator} object. The 
	 * {@link ParallelSystemArrayMediator} object distributes the *parallel process* to its slaves system,
	 * {@link ParallelSystem} objects. When the *parallel process* has completed, then {@link MediatorSystem} reports the 
	 * result to its **master**.
	 * 
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 * 
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System),
	 *			 [Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class MediatorSystem
		extends slave.SlaveSystem
	{
		/**
		 * @hidden
		 */
		private system_array_: ParallelSystemArrayMediator | distributed.DistributedSystemArrayMediator;
		
		/**
		 * @hidden
		 */
		private progress_list_: std.HashMap<number, protocol.InvokeHistory>;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Construct from parent {@link ParallelSystemArrayMediator} object.
		 * 
		 * @param systemArray The parent {@link ParallelSystemArrayMediator} object.
		 */
		public constructor(systemArray: ParallelSystemArrayMediator);

		/**
		 * Construct from parent {@link DistributedSystemArrayMediator} object.
		 * 
		 * @param systemArray The parent {@link DistributedSystemArrayMediator} object.
		 */
		public constructor(systemArray: distributed.DistributedSystemArrayMediator)
		
		public constructor(systemArray: ParallelSystemArrayMediator | distributed.DistributedSystemArrayMediator)
		{
			super();

			this.system_array_ = systemArray;
			this.progress_list_ = new std.HashMap<number, protocol.InvokeHistory>();
		}

		/**
		 * Start interaction.
		 * 
		 * The {@link start start()} is an abstract method starting interaction with the **master** system. If the 
		 * **master** is a server, then connects to the **master**. Otherwise, the **master** is client, then this 
		 * {@link MediatorSystem} object wil open a server accepting the **master**.
		 */
		public abstract start(): void;
		
		/* ---------------------------------------------------------
			ACCESSOR
		--------------------------------------------------------- */
		/**
		 * Get parent {@link ParallelSystemArrayMediator} object.
		 */
		public getSystemArray(): ParallelSystemArrayMediator | distributed.DistributedSystemArrayMediator
		{
			return this.system_array_;
		}

		/* ---------------------------------------------------------
			MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private complete_history(uid: number): void
		{
			// NO SUCH HISTORY; THE PROCESS HAD DONE ONLY IN THIS MEDIATOR LEVEL.
			if (this.progress_list_.has(uid) == false)
				return;

			// COMPLETE THE HISTORY
			let history: protocol.InvokeHistory = this.progress_list_.get(uid);
			let start_time: Date = null;
			let end_time: Date = null;

			// DETERMINE WHEN STARTED AND COMPLETED TIME
			for (let i: number = 0; i < this.system_array_.size(); i++)
			{
				let system: ParallelSystem = this.system_array_.at(i);
				
				let it: std.MapIterator<number, protocol.InvokeHistory> = system["history_list_"].find(uid);
				if (it.equal_to(system["history_list_"].end()) == true)
					continue;
				
				let my_history: protocol.InvokeHistory = it.second;
				if (start_time == null || my_history.getStartTime() < start_time)
					start_time = my_history.getStartTime();
				if (end_time == null || my_history.getEndTime() > end_time)
					end_time = my_history.getEndTime();
			}
			history["start_time_"] = start_time;
			history["end_time_"] = end_time;
			
			// ERASE THE HISTORY ON PROGRESS LIST
			this.progress_list_.erase(uid);
			
			// REPORT THE HISTORY TO MASTER
			this.sendData(history.toInvoke());
		}

		/**
		 * @hidden
		 */
		protected _replyData(invoke: protocol.Invoke): void
		{
			if (invoke.has("_History_uid") == true)
			{
				// INIT HISTORY OBJECT
				let history: protocol.InvokeHistory = new protocol.InvokeHistory(invoke);

				if (this.system_array_.empty() == true)
				{
					// NO BELONGED SLAVE, THEN SEND BACK
					this.sendData(new protocol.Invoke("_Send_back_history", history.getUID()));
					return;
				}

				// REGISTER THIS PROCESS ON HISTORY LIST
				this.progress_list_.insert([history.getUID(), history]);

				if (invoke.has("_Piece_first") == true)
				{
					// PARALLEL PROCESS
					let first: number = invoke.get("_Piece_first").getValue();
					let last: number = invoke.get("_Piece_last").getValue();

					invoke.erase(invoke.end().advance(-2), invoke.end());
					this.system_array_.sendPieceData(invoke, first, last);
				}
				else if (this.system_array_ instanceof distributed.DistributedSystemArrayMediator
					&& invoke.has("_Process_name") == true)
				{
					// DISTRIBUTED PROCESS
					let ds_system_array: distributed.DistributedSystemArrayMediator 
						= this.system_array_ as distributed.DistributedSystemArrayMediator;

					// FIND THE MATCHED ROLE
					let process_name: string = invoke.get("_Process_name").getValue();
					if (ds_system_array.hasProcess(process_name) == false)
						return;

					// SEND DATA VIA THE ROLE
					let process: distributed.DistributedProcess = ds_system_array.getProcess(process_name);
					process.sendData(invoke);
				}
			}
			else
				this.replyData(invoke);
		}

		/**
		 * @inheritdoc
		 */
		public replyData(invoke: protocol.Invoke): void
		{
			this.system_array_.sendData(invoke);
		}
	}
}

namespace samchon.templates.parallel
{
	/**
	 * A mediator server, driver for the master client.
	 * 
	 * The {@link MediatorServer} is a class opening a server accepting the **master** client, following the protocol of 
	 * Samchon Framework's own.
	 * 
	 * #### [Inherited] {@link MediatorSystem}
	 * The {@link MediatorSystem} is an abstract class helping {@link ParallelSystemArrayMediator} can be a **slave**
	 * system. The {@link MediatorSystem} interacts and communicates with the **master** system as a role of **slave**.
	 *
	 * This {@link MediatorSystem} object is created in {@link ParallelSystemArrayMediator.createMediator}. Override the
	 * method and return one of them, which are derived from this {@link MediatorSystem} class, considering which
	 * type and protocol the **master** system follows:
	 *
	 * - A client slave connecting to master server:
	 *   - {@link MediatorClient}
	 *   - {@link MediatorWebClient}
	 *   - {@link MediatorSharedWorkerClient}
	 * - A server slave accepting master client:
	 *   - {@link MediatorServer}
	 *   - {@link MediatorWebServer}
	 *   - {@link MediatorSharedWorkerServer}
	 *
	 * When the **master** orders a *parallel process* to this **slave**, then the {@link MediatorSystem} delivers the
	 * *parallel process* to its parent {@link ParallelSystemArrayMediator} object. The
	 * {@link ParallelSystemArrayMediator} object distributes the *parallel process* to its slaves system,
	 * {@link ParallelSystem} objects. When the *parallel process* has completed, then {@link MediatorSystem} reports the
	 * result to its **master**.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System),
	 *			 [Templates - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class MediatorServer
		extends MediatorSystem
		implements slave.ISlaveServer
	{
		/**
		 * @hidden
		 */
		private server_base_: protocol.IServerBase;
		
		/**
		 * @hidden
		 */
		private port: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Initializer Constructor.
		 * 
		 * @param systemArray The parent {@link ParallelSystemArrayMediator} object.
		 * @param port Port number of server to open.
		 */
		public constructor(systemArray: ParallelSystemArrayMediator, port: number);

		/**
		 * Initializer Constructor.
		 * 
		 * @param systemArray The parent {@link DistributedSystemArrayMediator} object.
		 * @param port Port number of server to open.
		 */
		public constructor(systemArray: distributed.DistributedSystemArrayMediator, port: number);

		public constructor
			(
				systemArray: ParallelSystemArrayMediator | distributed.DistributedSystemArrayMediator, 
				port: number
			)
		{
			super(systemArray as ParallelSystemArrayMediator);
			this.port = port;
		}

		/**
		 * Factory method creating {@link IServerBase} object.
		 * 
		 * This method {@link createServerBase createServerBase()} determines which protocol is used in this server,
		 * {@link MediatorServer}. Note that, **slave** (this {@link MediatorServer} object) must follow the **master**'s 
		 * protocol.
		 *
		 * Overrides and return one of them considering the which protocol to follow:
		 *
		 * - {@link ServerBase}
		 * - {@link WebServerBase}
		 * - {@link SharedWorkerServerBase}
		 */
		protected createServerBase(): protocol.IServerBase
		{
			return new protocol.ServerBase(this);
		}

		/**
		 * Add a newly connected remote client.
		 * 
		 * {@link MediatorServer} represents a **slave** dedicating to its **master**. In that reason, the
		 * {@link MediatorServer} does not accept multiple **master** clients. It accepts only one. Thus, *listener* of
		 * the *communicator* is {@link MediatorSystem} object, itself.
		 * 
		 * @param driver A communicator with remote client.
		 */
		public addClient(driver: protocol.IClientDriver): void
		{
			this.communicator_ = driver;
			driver.listen(this);
		}

		/* ---------------------------------------------------------
			SERVER's METHOD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public start(): void
		{
			this.open(this.port);
		}

		/**
		 * @inheritdoc
		 */
		public open(port: number): void
		{
			this.server_base_ = this.createServerBase();
			if (this.server_base_ == null)
				return;

			this.server_base_.open(port);
		}

		/**
		 * @inheritdoc
		 */
		public close(): void
		{
			if (this.server_base_ != null)
				this.server_base_.close();
		}
	}

	/**
	 * A mediator server, driver for the master client.
	 * 
	 * The {@link MediatorWebServer} is a class opening a server accepting the **master** client, following the 
	 * web-socket protocol.
	 * 
	 * #### [Inherited] {@link MediatorSystem}
	 * The {@link MediatorSystem} is an abstract class helping {@link ParallelSystemArrayMediator} can be a **slave**
	 * system. The {@link MediatorSystem} interacts and communicates with the **master** system as a role of **slave**.
	 *
	 * This {@link MediatorSystem} object is created in {@link ParallelSystemArrayMediator.createMediator}. Override the
	 * method and return one of them, which are derived from this {@link MediatorSystem} class, considering which
	 * type and protocol the **master** system follows:
	 *
	 * - A client slave connecting to master server:
	 *   - {@link MediatorClient}
	 *   - {@link MediatorWebClient}
	 *   - {@link MediatorSharedWorkerClient}
	 * - A server slave accepting master client:
	 *   - {@link MediatorServer}
	 *   - {@link MediatorWebServer}
	 *   - {@link MediatorSharedWorkerServer}
	 *
	 * When the **master** orders a *parallel process* to this **slave**, then the {@link MediatorSystem} delivers the
	 * *parallel process* to its parent {@link ParallelSystemArrayMediator} object. The
	 * {@link ParallelSystemArrayMediator} object distributes the *parallel process* to its slaves system,
	 * {@link ParallelSystem} objects. When the *parallel process* has completed, then {@link MediatorSystem} reports the
	 * result to its **master**.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System),
	 *			 [Templates - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class MediatorWebServer extends MediatorServer
	{
		/**
		 * @inheritdoc
		 */
		protected createServerBase(): protocol.IServerBase
		{
			return new protocol.WebServerBase(this);
		}
	}

	/**
	 * A mediator server, driver for the master client.
	 * 
	 * The {@link MediatorSharedWorkerServer} is a class opening a server accepting the **master** client, following the
	 * SharedWorker's protocol.
	 * 
	 * #### [Inherited] {@link MediatorSystem}
	 * The {@link MediatorSystem} is an abstract class helping {@link ParallelSystemArrayMediator} can be a **slave**
	 * system. The {@link MediatorSystem} interacts and communicates with the **master** system as a role of **slave**.
	 *
	 * This {@link MediatorSystem} object is created in {@link ParallelSystemArrayMediator.createMediator}. Override the
	 * method and return one of them, which are derived from this {@link MediatorSystem} class, considering which
	 * type and protocol the **master** system follows:
	 *
	 * - A client slave connecting to master server:
	 *   - {@link MediatorClient}
	 *   - {@link MediatorWebClient}
	 *   - {@link MediatorSharedWorkerClient}
	 * - A server slave accepting master client:
	 *   - {@link MediatorServer}
	 *   - {@link MediatorWebServer}
	 *   - {@link MediatorSharedWorkerServer}
	 *
	 * When the **master** orders a *parallel process* to this **slave**, then the {@link MediatorSystem} delivers the
	 * *parallel process* to its parent {@link ParallelSystemArrayMediator} object. The
	 * {@link ParallelSystemArrayMediator} object distributes the *parallel process* to its slaves system,
	 * {@link ParallelSystem} objects. When the *parallel process* has completed, then {@link MediatorSystem} reports the
	 * result to its **master**.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System),
	 *			 [Templates - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class MediatorSharedWorkerServer extends MediatorServer
	{
		/**
		 * @inheritdoc
		 */
		protected createServerBase(): protocol.IServerBase
		{
			return new protocol.SharedWorkerServerBase(this);
		}
	}
}

namespace samchon.templates.parallel
{
	/**
	 * A mediator client, driver for the master server.
	 * 
	 * The {@link MediatorServer} is a class being a client connecting to the **master** server, following the protocol 
	 * of Samchon Framework's own.
	 * 
	 * #### [Inherited] {@link MediatorSystem}
	 * The {@link MediatorSystem} is an abstract class helping {@link ParallelSystemArrayMediator} can be a **slave**
	 * system. The {@link MediatorSystem} interacts and communicates with the **master** system as a role of **slave**.
	 *
	 * This {@link MediatorSystem} object is created in {@link ParallelSystemArrayMediator.createMediator}. Override the
	 * method and return one of them, which are derived from this {@link MediatorSystem} class, considering which
	 * type and protocol the **master** system follows:
	 *
	 * - A client slave connecting to master server:
	 *   - {@link MediatorClient}
	 *   - {@link MediatorWebClient}
	 *   - {@link MediatorSharedWorkerClient}
	 * - A server slave accepting master client:
	 *   - {@link MediatorServer}
	 *   - {@link MediatorWebServer}
	 *   - {@link MediatorSharedWorkerServer}
	 *
	 * When the **master** orders a *parallel process* to this **slave**, then the {@link MediatorSystem} delivers the
	 * *parallel process* to its parent {@link ParallelSystemArrayMediator} object. The
	 * {@link ParallelSystemArrayMediator} object distributes the *parallel process* to its slaves system,
	 * {@link ParallelSystem} objects. When the *parallel process* has completed, then {@link MediatorSystem} reports the
	 * result to its **master**.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System),
	 *			 [Templates - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class MediatorClient
		extends MediatorSystem
		implements slave.ISlaveClient
	{
		/**
		 * @hidden
		 */
		private ip: string;
		
		/**
		 * @hidden
		 */
		private port: number;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Initializer Constructor.
		 * 
		 * @param systemArray The parent {@link ParallelSystemArrayMediator} object.
		 * @param ip IP address to connect.
		 * @param port Port number to connect.
		 */
		public constructor(systemArray: ParallelSystemArrayMediator, ip: string, port: number);

		/**
		 * Initializer Constructor.
		 * 
		 * @param systemArray The parent {@link DistributedSystemArrayMediator} object.
		 * @param ip IP address to connect.
		 * @param port Port number to connect.
		 */
		public constructor(systemArray: distributed.DistributedSystemArrayMediator, ip: string, port: number);

		public constructor
			(
				systemArray: ParallelSystemArrayMediator | distributed.DistributedSystemArrayMediator, 
				ip: string, port: number
			)
		{
			super(systemArray as ParallelSystemArrayMediator);

			this.ip = ip;
			this.port = port;
		}

		/**
		 * Factory method creating {@link IServerConnector} object.
		 * 
		 * The {@link createServerConnector createServerConnector()} is an abstract method creating 
		 * {@link IServerConnector} object. Overrides and returns one of them, considering which protocol the **master** 
		 * server follows:
		 * 
		 * - {@link ServerConnector}
		 * - {@link WebServerConnector}
		 * - {@link SharedWorkerServerConnector}
		 * 
		 * @return A newly created {@link IServerConnector} object.
		 */
		protected createServerConnector(): protocol.IServerConnector
		{
			return new protocol.ServerConnector(this);
		}

		/* ---------------------------------------------------------
			METHOD OF CONNECTOR
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public start(): void
		{
			this.connect();
		}

		/**
		 * @inheritdoc
		 */
		public connect(): void
		{
			if (this.communicator_ != null)
				return;

			this.communicator_ = this.createServerConnector();
			(this.communicator_ as protocol.IServerConnector).connect(this.ip, this.port);
		}
	}

	/**
	 * A mediator client, driver for the master server.
	 * 
	 * The {@link MediatorWebClient} is a class being a client connecting to the **master** server, following the 
	 * web-socket protocol.
	 * 
	 * #### [Inherited] {@link MediatorSystem}
	 * The {@link MediatorSystem} is an abstract class helping {@link ParallelSystemArrayMediator} can be a **slave**
	 * system. The {@link MediatorSystem} interacts and communicates with the **master** system as a role of **slave**.
	 *
	 * This {@link MediatorSystem} object is created in {@link ParallelSystemArrayMediator.createMediator}. Override the
	 * method and return one of them, which are derived from this {@link MediatorSystem} class, considering which
	 * type and protocol the **master** system follows:
	 *
	 * - A client slave connecting to master server:
	 *   - {@link MediatorClient}
	 *   - {@link MediatorWebClient}
	 *   - {@link MediatorSharedWorkerClient}
	 * - A server slave accepting master client:
	 *   - {@link MediatorServer}
	 *   - {@link MediatorWebServer}
	 *   - {@link MediatorSharedWorkerServer}
	 *
	 * When the **master** orders a *parallel process* to this **slave**, then the {@link MediatorSystem} delivers the
	 * *parallel process* to its parent {@link ParallelSystemArrayMediator} object. The
	 * {@link ParallelSystemArrayMediator} object distributes the *parallel process* to its slaves system,
	 * {@link ParallelSystem} objects. When the *parallel process* has completed, then {@link MediatorSystem} reports the
	 * result to its **master**.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System),
	 *			 [Templates - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class MediatorWebClient
		extends MediatorClient
	{
		/**
		 * @inheritdoc
		 */
		protected createServerConnector(): protocol.IServerConnector
		{
			return new protocol.WebServerConnector(this);
		}
	}

	/**
	 * A mediator client, driver for the master server.
	 * 
	 * The {@link MediatorSharedWorkerClient} is a class being a client connecting to the **master** server, following 
	 * the SharedWorker's protocol.
	 * 
	 * #### [Inherited] {@link MediatorSystem}
	 * The {@link MediatorSystem} is an abstract class helping {@link ParallelSystemArrayMediator} can be a **slave**
	 * system. The {@link MediatorSystem} interacts and communicates with the **master** system as a role of **slave**.
	 *
	 * This {@link MediatorSystem} object is created in {@link ParallelSystemArrayMediator.createMediator}. Override the
	 * method and return one of them, which are derived from this {@link MediatorSystem} class, considering which
	 * type and protocol the **master** system follows:
	 *
	 * - A client slave connecting to master server:
	 *   - {@link MediatorClient}
	 *   - {@link MediatorWebClient}
	 *   - {@link MediatorSharedWorkerClient}
	 * - A server slave accepting master client:
	 *   - {@link MediatorServer}
	 *   - {@link MediatorWebServer}
	 *   - {@link MediatorSharedWorkerServer}
	 *
	 * When the **master** orders a *parallel process* to this **slave**, then the {@link MediatorSystem} delivers the
	 * *parallel process* to its parent {@link ParallelSystemArrayMediator} object. The
	 * {@link ParallelSystemArrayMediator} object distributes the *parallel process* to its slaves system,
	 * {@link ParallelSystem} objects. When the *parallel process* has completed, then {@link MediatorSystem} reports the
	 * result to its **master**.
	 *
	 * <a href="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		  target="_blank">
	 *	<img src="http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png"
	 *		 style="max-width: 100%" />
	 * </a>
	 *
	 * @handbook [Templates - Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel_System),
	 *			 [Templates - Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class MediatorSharedWorkerClient
		extends MediatorClient
	{
		/**
		 * @inheritdoc
		 */
		protected createServerConnector(): protocol.IServerConnector
		{
			return new protocol.SharedWorkerServerConnector(this);
		}
	}
}