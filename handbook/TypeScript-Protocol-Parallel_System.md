# Parallel System
Module *Parallel System* provides module for realizing parallel processing system.

## References
#### Conceptual Diagram
![Conceptual Diagram](http://samchon.github.io/framework/images/design/conceptual_diagram/parallel_system.png)

#### Class Diagram
![Protocol - Parallel System](http://samchon.github.io/framework/images/design/ts_class_diagram/protocol_parallel_system.png)

#### API Documents
  - [**ParallelSystemArray**](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.parallel.parallelsystemarray.html)
    - [ParallelClientArray](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.parallel.parallelclientarray.html)
    - [ParallelServerAaray](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.parallel.parallelserverarray.html)
    - [ParallelServerClientArray](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.parallel.parallelserverclientarray.html)
  - [**ParallelSystemArrayMediator**](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.parallel.parallelsystemarraymediator.html)
    - [ParallelClientArrayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.parallel.parallelclientarraymediator.html)
    - [ParallelServerAarayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.parallel.parallelserverarraymediator.html)
    - [ParallelServerClientArrayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.parallel.parallelserverclientarraymediator.html)
  - [**ParallelSystem**](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.parallel.parallelsystem.html)
    - [ParallelClient](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.parallel.parallelclient.html)
    - [ParallelServer](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.parallel.parallelserver.html)

#### Source Codes
  - [**ParallelSystemArray.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/parallel/ParallelSystemArray.ts)
    - [ParallelClientArray.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/parallel/ParallelClientArray.ts)
    - [ParallelServerAaray.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/parallel/ParallelServerAaray.ts)
    - [ParallelServerClientArray.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/parallel/ParallelServerClientArray.ts)
  - [**ParallelSystemArrayMediator.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/parallel/ParallelSystemArrayMediator.ts)
    - [ParallelClientArrayMediator.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/parallel/ParallelClientArrayMediator.ts)
    - [ParallelServerAarayMediator.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/parallel/ParallelServerAarayMediator.ts)
    - [ParallelServerClientArrayMediator.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/parallel/ParallelServerClientArrayMediator.ts)
  - [**ParallelSystem.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/parallel/ParallelSystem.ts)
    - [ParallelClient.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/parallel/ParallelClient.ts)
    - [ParallelServer.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/protocol/parallel/ParallelServer.ts)


## Basic Classes
### ParallelSystemArray
### ParallelSystemArrayMediator
#### MediatorSystem
### ParallelSystem


## Derived Classes
### ParallelSystemArray
#### ParallelClientArray
```typescript
namespace samchon.protocol.external
{
	export interface IExternalClientArray
		extends ExternalSystemArray, IServer
	{
	}
}

namespace samchon.protocol.parallel
{
	export class ParallelClientArray
		extends ParallelSystemArray
		implements external.IExternalClientArray
	{
		private server_base: IServerBase;
		
		//--------
		// METHODS TO OVERRIDE
		//--------
		// FACTORY METHOD CREATING SERVER_BASE OBJECT
		// RETURN ONE OF THEM FOLLOWING SPECIFIED PROTOCOL
		// 	- ServerBase
		// 	- WebServerBase
		// 	- SharedWorkerServerBase
		protected abstract createServerBase(): IServerBase;
		
		// FACTORY METHOD CREATING PARALLEL_SYSTEM OBJECT
		protected abstract createExternalClient(driver: IClientDriver): ParallelSystem;
		
		//--------
		// METHODS OF ISERVER -> HOOK TO SERVER_BASE OBJECT
		//--------
		public open(port: number): void
		{
			this.server_base = this.createServerBase();
			this.server_base.open(port);
		}
		public close(): vcid
		{
			this.server_base.close();
		}
		public addClient(driver: IClientDriver): void
		{
			let system: ExternalSystem = this.createExternalClient(driver);
			this.push_back(system);
		}
	}
}
```
#### ParallelServerArray
```typescript
namespace samchon.protocol.external
{
	export interface IExternalServerArray
		extends ExternalSystemArray
	{
		// MAY CALL CHILDREN IExternalServer.connect() METHODS
		connect(): void;
	}
}

namespace samchon.protocol.parallel
{
	export abstract class ParallelServerArray
		extends external.ExternalSystemArray
	{
		// VERY SIMPLE. JUST CALL CHILDREN IExternalServer.connect()
		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
				(this.at(i) as IExternalServer).connect();
		}
	}
}
```

#### ParallelServerClientArray
```typescript
namespace samchon.protocol.parallel
{
	export abstract class ParallelServerClientArray
		extends ParallelClientArray // a server accepting external clients
		implements external.IExternalServerArray // a client connecting to external servers
	{
		//--------
		// A METHOD TO OVERRIDE
		//--------
		// FACTORY METHOD CREATING EXTERNAL_SERVER OBJECT VIA XML
		protected createExternalServer(xml: library.XML): IExternalServer;
	
		//--------
		// METHODS OF EXTERNAL_SERVER_ARRAY
		//--------
		// SHIFT FACTORY METHOD TO CREATE_EXTERNAL_SERVER
		public createChild(xml: library.XML): IExternalServer
		{
			return this.createExternalServer(xml);
		}
		
		// WHEN CHILD IS A TYPE OF IExternalServer,
		// THEN CALL IExternalServer.connect()
		public connect(): void
		{
			for (let i: number = 0; i < this.size(); i++)
				if (this.at(i)["connect"] != undefined)
					(this.at(i) as IExternalServer).connect();
		}
	}
}
```

### ParallelSystemArrayMediator
```typescript
namespace samchon.protocol.parallel
{
	export class ParallelSystemArrayMediator
		extends ParallelSystemArray
	{
		private mediator: MediatorSystem;
		
		protectected abstract createMediator(): MediatorSystem;
	}
}
```

  - MediatorClient
    - MediatorClient
    - WebMediatorClient
    - SharedWorkerMediatorClient
  - MediatorServer
    - MediatorServer
    - WebMediatorServer
    - SharedWorkerMedaitorServer
```

### ParallelSystem
#### ParallelClient
#### ParallelServer


## Example Project
#### Related Module
Referencing related modules, it will be much helpful for comprehending this *Parallel System Module*.

Name | Source | Documents
----|----|---
Distributed System | [protocol/distributed](https://github.com/samchon/framework/tree/master/ts/src/samchon/protocol/distributed) | [API](http://samchon.github.io/framework/api/ts/modules/samchon.protocol.distributed.html), [Guidance](TypeScript-Protocol-Distributed_System)
Slave System | [protocol/slave](https://github.com/samchon/framework/tree/master/ts/src/samchon/protocol/slave) | [API](http://samchon.github.io/framework/api/ts/modules/samchon.protocol.slave.html), [Guidance](TypeScript-Protocol-Slave_System)

#### Interaction
![Conceptual Diagram](http://samchon.github.io/framework/images/design/conceptual_diagram/interaction.png)

**Interaction** is an example implemented *Tree-structured Distributed & Parallel Processing System*. The Interaction provides ultimate guidance; how to use *External System* and its derived modules.

[**Go to the Interaction**](Examples-Interaction)