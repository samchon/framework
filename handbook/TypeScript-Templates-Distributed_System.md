# Distributed System
A template module for **Distributed Processing System** in master side.

## References
#### Conceptual Diagram
![Conceptual Diagram](http://samchon.github.io/framework/images/design/conceptual_diagram/external_vs_distributed.png)

#### Class Diagram
![Protocol - Distributed System](http://samchon.github.io/framework/images/design/ts_class_diagram/templates_distributed_system.png)

#### API Documents
  - [**DistributedSystemArray**](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystemarray.html)
    - [DistributedClientArray](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedclientarray.html)
    - [DistributedServerAaray](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedserverarray.html)
    - [DistributedServerClientArray](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedserverclientarray.html)
  - [**DistributedSystemArrayMediator**](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystemarraymediator.html)
    - [DistributedClientArrayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedclientarraymediator.html)
    - [DistributedServerAarayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedserverarraymediator.html)
    - [DistributedServerClientArrayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedserverclientarraymediator.html)
  - [**DistributedSystem**](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystem.html)
    - [DistributedClient](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedclient.html)
    - [DistributedServer](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedserver.html)

#### Source Codes
  - [**DistributedSystemArray.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/distributed/DistributedSystemArray.ts)
    - [DistributedClientArray.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/distributed/DistributedClientArray.ts)
    - [DistributedServerAaray.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/distributed/DistributedServerAaray.ts)
    - [DistributedServerClientArray.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/distributed/DistributedServerClientArray.ts)
  - [**DistributedSystemArrayMediator.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/distributed/DistributedSystemArrayMediator.ts)
    - [DistributedClientArrayMediator.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/distributed/DistributedClientArrayMediator.ts)
    - [DistributedServerAarayMediator.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/distributed/DistributedServerAarayMediator.ts)
    - [DistributedServerClientArrayMediator.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/distributed/DistributedServerClientArrayMediator.ts)
  - [**DistributedSystem.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/distributed/DistributedSystem.ts)
    - [DistributedClient.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/distributed/DistributedClient.ts)
    - [DistributedServer.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/distributed/DistributedServer.ts)


## Basic Classes
### [DistributedSystemArray](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystemarray.html)
Master of Distributed Processing System.

The [DistributedSystemArray](#distributedsystemarray) is an abstract class containing and managing remote distributed **slave** system drivers, [DistributedSystem](#distributedsystem) objects. Within framework of network, [DistributedSystemArray](#distributedsystemarray) represents your system, a **Master** of **Distributed Processing System** that requesting distributed process to **slave** systems and the children [DistributedSystem](#distributedsystem) objects represent the remote **slave** systems, who is being requested the *Distributed Processes*.

You can specify this [DistributedSystemArray](#distributedsystemarray) class to be a server accepting distributed clients or a client connecting to distributed servers. Even both of them is possible. Extends one of them below and overrides abstract factory method(s) creating the child [DistributedSystem](#distributedsystem) object.

  - [DistributedClientArray](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedclientarray.html): A server accepting distributed clients.
  - [DistributedServerArray](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedserverarray.html): A client connecting to distributed servers.
  - [DistributedServerClientArray](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedserverclientarray.html): Both of them. Accepts distributed clients and connects to distributed servers at the same time.

The [DistributedSystemArray](#distributedsystemarray) contains [DistributedProcess](#distributedprocess) objects directly. You can request *Distributed Processes* through the [DistributedProcess](#distributedprocess) object. You can access the [DistributedProcess](#distributedprocess) object(s) with those methods:

  - [hasProcess](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystemarray.html#hasprocess)
  - [getProcess](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystemarray.html#getprocess)
  - [insertProcess](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystemarray.html#insertprocess)
  - [eraseProcess](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystemarray.html#eraseprocess)
  - [getProcessMap](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystemarray.html#getprocessmap)

When you need the *Distributed Process*, call the [DistributedProcess.sendData](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedprocess.html#senddata) method. Then the [DistributedProcess](#distributedprocess) will find the most idle [DistributedSystem](#distributedsystem) object who represents a distributed slave system. The Invoke message will be sent to the most idle [DistributedSystem](#distributedsystem) object. When the *Distributed Process* has completed, then [performance index](#performance-index) and [resource index](#resource-index) of related objects will be revaluated.

##### Parallel Process
This [DistributedSystemArray](#distributedsystemarray) class is derived from the [ParallelSystemArray](TypeScript-Templates-Parallel_System#parallelsystemarray) class, so you can request the *Parallel Processes*, too.

When you need the a *Parallel Process*, then call one of them: [sendSegmentData](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystemarray.html#sendsegmentdata) or [sendPieceData](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystemarray.html#sendpiecedata). When the parallel process has completed, [DistributedSystemArray](#distributedsystemarray) estimates each [DistributedSystem](#distributedsystem)'s performance index basis on their execution time. Those [performance indices](#performance-index) will be reflected to the next *Parallel Process*, how much pieces to allocate to each [DistributedSystem](#distributedsystem).

### [DistributedSystem](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystem.html)
A driver for a distributed slave system.

The [DistributedSystem](#distributedsystem) is an abstract class represents a slave system in **Distributed Processing System**, connected with this master system. This [DistributedSystem](#distributedsystem) takes full charge of network communication with the remote, distributed **slave** system has connected.

This [DistributedSystem](#distributedsystem) has a [performance index](#performance-index) that indicates how much the **slave** system is fast. The [performance index](#performance-index) is referenced and revaluated whenever those methods are called:

  - Requesting a parallel process
    - [DistributedSystemArray.sendSegmentData](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystemarray.html#sendsegmentdata)
    - [DistributedSystemArray.sendPieceData](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystemarray.html#sendpiecedata)
  - Requesting a distributed process: 
    - [DistributedProcess.sendData](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedprocess.html#senddata)

Note that, this DistributedSystem class derived from the ExternalSystem class. Thus, this [DistributedSystem](#distributedsystem) can also have children ExternalSystemRole objects exclusively. However, the children roles objects are different with the [DistributedProcess](#distributedprocess). The domestic roles are belonged to only a specific [DistributedSystem](#distributedsystem) object. Otherwise, the [DistributedProcess](#distributedprocess) objects are belonged to a [DistributedSystemArray](#distributedsystemarray) object. Furthermore, the relationship between this [DistributedSystem](#distributedsystem) and [DistributedProcess](#distributedprocess) classes are M: N Associative.

Articles     | [DistributedProcess](#distributedprocess)         | [ExternalSystemRole](#externalsystemrole)
-------------|------------------------|-----------------------------------------------------------------------
Belonged to  | [DistributedSystemArray](#distributedsystemarray) | [DistributedSystem](#distributedsystem)
Relationship | M: N Associative                                  | 1: N Composite
Ownership    | References                                        | Exclusive possession

##### Performance index
The [performance index](#performance index) indicates how much fast the remote **slave** system ([ParallelSystem](#parallelsystem)) is.

If the [DistributedSystem](#distributedsystem) does not have any [Invoke message](TypeScript-Protocol-Standard_Message#invoke) had handled, then the [performance index](#performance index) will be ```1.0```, which means default and average value between all [DistributedSystem](#distributedsystem) instances (that are belonged to a same [DistributedSystemArray](#distributedsystemarray) object).

You can specify the [performance index](#performance index) by yourself but notice that, if the [performance index](#performance index) is higher than other [DistributedSystem](#distributedsystem) objects, then the [DistributedSystem](#distributedsystem) object will be ordered to handle more processes than others. Otherwise, the [performance index](#performance-index) is lower than others, of course, less processes will be delivered.

When ```DistributedSystemArray.sendSegmentData($something, 100)``` has called,

Name    | Performance index | Number of pieces to be allocated | Formula
--------|-------------------|----------------------------------|--------------
Snail   |                 1 |                               10 | 100 / 10 * 1
Cheetah |                 4 |                               40 | 100 / 10 * 4
Rabbit  |                 3 |                               30 | 100 / 10 * 3
Turtle  |                 2 |                               20 | 100 / 10 * 2

Unless [enforcePerformance](#enforceperformance) is called, this [performance index](#performance index) is **revaluated** whenever user calles one of them below.

  - [ParallelSystemArray.sendSegmentData](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystemarray.html#sendsegmentdata)
  - [ParallelSystemArray.sendPieceData](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystemarray.html#sendpiecedata)
  - [DistributedProcess.sendData](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedprocess.html#senddata)

###### setPerformance
Set [performance index](#performance index), but it's not fixed. The newly configured [performance index](#performance index) can be changed by the **revaluation**.

###### enforcePerformance
Set [performance index](#performance index) and it's **fixed**. The newly configured [performance index](#performance index) does **not be revaluated**.

### [DistributedProcess](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedprocess.html)
A process of Distributed Processing System.

The [DistributedProcess](#distributedprocess) is an abstract class who represents a process, *SOMETHING TO DISTRIBUTE* in a Distributed Processing System. Overrides the [DistributedProcess](#distributedprocess) and defines the *SOMETHING TO DISTRIBUTE*.

Relationship between [DistributedSystem](#distributedsystem) and [DistributedProcess](#distributedprocess) objects are M: N Associative. Unlike ExternalSystemRole, the [DistributedProcess](#distributedprocess) objects are not belonged to a specific [DistributedSystem](#distributedsystem) object. The [DistributedProcess](#distributedprocess) objects are belonged to the [DistributedSystemArrayMediator](#distributedsystemarraymediator) directly.

When you need the *distributed process*, then call [sendData()](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedprocess.html#senddata). The [sendData](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedprocess.html#senddata) will find the most idle slave system considering not only number of processes on progress, but also [performance index](#performance-index) of each [DistributedSystem](#distributedsystem) object and [resource index](#resource-index) of this [DistributedProcess](#distributedprocess) object. The Invoke message requesting the distributed process will be sent to the most idle slave system.

Those [performance index](#performance-index) and [resource index](#resource-index) are revaluated whenever the distributed process has completed basis on the execution time.

##### Resource index
indicates how much the process is heavy.

If the process does not have any [Invoke message](TypeScript-Protocol-Standard_Message#invoke) had handled, then the **resource index** will be ```1.0```, which means default and average value between all [DistributedProcess](#distributedprocess) instances (that are belonged to a same [DistributedSystemArray](#distributedsystemarray) object).

You can specify the resource index by yourself, but notice that, if the [resource index](#resource-index) is higher than other [DistributedProcess](#distributedprocess) objects, then this role will be ordered to handle less processes than other [DistributedProcess](#distributedprocess) objects. Otherwise, the [resource index](#resource-index) is lower than others, of course, much processes will be requested.

###### setResource
Set [resource index](#resource-index), but not fixed. The newly configured [resource index](#resource-index) can be changed by the **revaluation**.

###### estimateResource
Set [resource index](#resource-index) and it's **fixed**. The newly configured [resource index](#resource-index) can't be changed by the relvaluation.

### [ExternalSystemRole](http://samchon.github.io/framework/api/ts/classes/samchon.templates.external.externalsystemrole.html)
This *Distributed System* module has implemented by extending the [External System](TypeScript-Templates-External_System) module. Thus, a [DistributedSystem](#distributedsystem) object can contain [ExternalSystemRole](#externalsystemrole) objects and utilizing the [Proxy Pattern](TypeScript-Templates-External_System#proxy-pattern) is also possible.

A role belonged to an external system.

The [ExternalSystemRole](#externalsystemrole) class represents a role, what to do. Extends this class and defines methods handling [Invoke message](TypeScript-Protocol-Standard_Message#invoke), which are related the specified role, what to do.

[ExternalSystemRole](#externalsystemrole) can be a *Logical Proxy* for an [DistributedSystem](#distributedsystem) which is containing the [ExternalSystemRole](#externalsystemrole). Of course, the [ExternalSystemRole](#externalsystemrole) is belonged to an [DistributedSystem](#distributedsystem). However, if you access an [ExternalSystemRole](#externalsystemrole) from an [DistributedSystemArray](#distributedsystemarray) directly, not passing by a belonged [DistributedSystem](#distributedsystem), and send an [Invoke message](TypeScript-Protocol-Standard_Message#invoke) even you're not knowing which [DistributedSystem](#distributedsystem) is related in, the [ExternalSystemRole](#externalsystemrole) acted a role of proxy.

With the *Logical Proxy*, you can only concentrate on [ExternalSystemRole](#externalsystemrole) itself, what to do with [Invoke messages](TypeScript-Protocol-Standard_Message#invoke), irrespective of the [ExternalSystemRole](#externalsystemrole) is belonged to which [DistributedSystem](#distributedsystem) object. Those pattern is called *Proxy Pattern*.

```typescript
/// <reference types="samchon-framework.d.ts" />

import samchon = require("samchon-framework");
import protocol = samchon.protocol;
import distributed = samchon.templates.distributed;

//--------
// MANAGER OF EXTERNAL FILE SERVERS' DRIVERS
//--------
var file_servers: distributed.DistributedSystemArray;

var png_data: Uint8Array; // DATA TO SAVE
var invoke: protocol.Invoke = new protocol.Invoke("save", "my_picture", "png", png_data); 
	// MESSAGE TO SEND

//--------
// YOU CAN SEND AN INVOKE MESSAGE WITHOUT SPECIFYING TARGET SYSTEM
// THE ExternalSystemRole OBJECT WILL ACT A ROLE NAMED "PROXY"
//--------
file_servers.getRole("image").sendData(invoke);
```

## Tree-structured Distributed Processing System
You can compose not only **1: N** *Distributed Processing System*, but also **tree-structured, recursive 1: N** *Parallel Processing System*.

![Conceptual Diagram](http://samchon.github.io/framework/images/design/conceptual_diagram/distributed_system.png)

### [DistributedSystemArrayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedsystemarraymediator.html)
Mediator of Distributed Processing System.

The [DistributedSystemArrayMediator](#distributedsystemarraymediator) class be a master for its **slave** systems, and be a slave to its **master** system **at the same time**. This [DistributedSystemArrayMediator](#distributedsystemarraymediator) be a **master** system, containing and managing [DistributedSystem](#distributedsystem) objects, which represent distributed slave systems, by extending [DistributedSystemArray](#distributedsystemarray) class. Also, be a **slave** system through mediator object, which is derived from the SlaveSystem class.

As a master, you can specify this [DistributedSystemArrayMediator](#distributedsystemarraymediator) class to be a master server accepting slave clients or a master client to connecting slave servers. Even both of them is possible. Extends one of them below and overrides abstract factory method(s) creating the child [DistributedSystem](#distributedsystem) object.

  - [DistributedClientArrayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedclientarraymediator.html): A server accepting distributed clients.
  - [DistributedServerArrayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedserverarraymediator.html): A client connecting to distributed servers.
  - [DistributedServerClientArrayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.distributed.distributedserverclientarraymediator.html): Both of them. Accepts distributed clients and connects to distributed servers at the same time.

As a slave, you can specify this [DistributedSystemArrayMediator](#distributedsystemarraymediator) to be a client slave connecting to master server or a server slave accepting master client by overriding the createMediator method. Overrides the createMediator() method and return one of them:

  - A client slave connecting to master server:
    - [MediatorClient](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.mediatorclient.html)
    - [MediatorWebClient](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.mediatorwebclient.html)
    - [MediatorSharedWorkerClient](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.mediatorsharedworkerclient.html)
  - A server slave accepting master client:
    - [MediatorServer](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.mediatorserver.html)
    - [MediatorWebServer](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.mediatorwebserver.html)
    - [MediatorSharedWorkerServer](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.mediatorsharedwebserver.html)

### [MediatorSystem](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.mediatorsystem.html)
A mediator, the master driver.

The [MediatorSystem](#mediatorsystem) is an abstract class helping [ParallelSystemArrayMediator](#parallelsystemarraymediator) can be a slave system. The [MediatorSystem](#mediatorsystem) interacts and communicates with the master system as a role of slave.

This [MediatorSystem](#mediatorsystem) object is created in [ParallelSystemArrayMediator.createMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystemarraymediator.html#createmediator). Override the method and return one of them, which are derived from this [MediatorSystem](#mediatorsystem) class, considering which type and protocol the master system follows:

  - A client slave connecting to master server:
    - [MediatorClient](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.mediatorclient.html)
    - [MediatorWebClient](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.mediatorwebclient.html)
    - [MediatorSharedWorkerClient](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.mediatorsharedworkerclient.html)
  - A server slave accepting master client:
    - [MediatorServer](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.mediatorserver.html)
    - [MediatorWebServer](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.mediatorwebserver.html)
    - [MediatorSharedWorkerServer](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.mediatorsharedwebserver.html)

When the master orders a parallel process to this slave, then the [MediatorSystem](#mediatorsystem) delivers the parallel process to its parent [ParallelSystemArrayMediator](#parallelsystemarraymediator) object. The [ParallelSystemArrayMediator](#parallelsystemarraymediator) object distributes the parallel process to its slaves system, [MediatorSystem](#mediatorsystem) objects. When the parallel process has completed, then [MediatorSystem](#mediatorsystem) reports the result to its master.

## Example Project
#### Interaction
![Conceptual Diagram](http://samchon.github.io/framework/images/design/conceptual_diagram/interaction.png)

**Interaction** is an example implemented *Tree-structured Distributed & Distributed Processing System*. The Interaction provides ultimate guidance; how to use *External System* and its derived modules.

[**Go to the Interaction**](Examples-Interaction)