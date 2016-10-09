# Parallel System
A template module for **Parallel Processing System** in master side.

## References
#### Conceptual Diagram
![Conceptual Diagram](http://samchon.github.io/framework/images/design/conceptual_diagram/external_vs_parallel.png)

#### Class Diagram
![Protocol - Parallel System](http://samchon.github.io/framework/images/design/ts_class_diagram/templates_parallel_system.png)

#### API Documents
  - [**ParallelSystemArray**](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystemarray.html)
    - [ParallelClientArray](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelclientarray.html)
    - [ParallelServerAaray](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelserverarray.html)
    - [ParallelServerClientArray](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelserverclientarray.html)
  - [**ParallelSystemArrayMediator**](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystemarraymediator.html)
    - [ParallelClientArrayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelclientarraymediator.html)
    - [ParallelServerAarayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelserverarraymediator.html)
    - [ParallelServerClientArrayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelserverclientarraymediator.html)
  - [**ParallelSystem**](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystem.html)
    - [ParallelClient](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystem.html)
    - [ParallelServer](http://samchon.github.io/framework/api/ts/classes/samchon.protocol.parallel.parallelserver.html)

#### Source Codes
  - [**ParallelSystemArray.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/parallel/ParallelSystemArray.ts)
    - [ParallelClientArray.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/parallel/ParallelClientArray.ts)
    - [ParallelServerAaray.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/parallel/ParallelServerAaray.ts)
    - [ParallelServerClientArray.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/parallel/ParallelServerClientArray.ts)
  - [**ParallelSystemArrayMediator.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/parallel/ParallelSystemArrayMediator.ts)
    - [ParallelClientArrayMediator.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/parallel/ParallelClientArrayMediator.ts)
    - [ParallelServerAarayMediator.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/parallel/ParallelServerAarayMediator.ts)
    - [ParallelServerClientArrayMediator.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/parallel/ParallelServerClientArrayMediator.ts)
  - [**ParallelSystem.ts**](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/parallel/ParallelSystem.ts)
    - [ParallelClient.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/parallel/ParallelClient.ts)
    - [ParallelServer.ts](https://github.com/samchon/framework/blob/master/ts/src/samchon/templates/parallel/ParallelServer.ts)


## Basic Classes
### [ParallelSystemArray](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystemarray.html)
Master of Parallel Processing System.

The [ParallelSystemArray](#parallelsystemarray) is an abstract class containing and managing remote parallel **slave** system drivers, [ParallelSystem](#parallelsystem) objects. Within framework of network, [ParallelSystemArray](#parallelsystemarray) represents your system, a **Master** of **Parallel Processing System** that requesting *Parallel Processes* to **slave** systems.

You can specify this [ParallelSystemArray](#parallelsystemarray) class to be *a server accepting parallel clients* or *a client connecting to parallel servers*. Even *both of them* is possible. Extends one of them below and overrides abstract factory method(s) creating the child ParallelSystem object.

  - [ParallelClientArray](#parallelclientarray): A server accepting parallel clients.
  - [ParallelServerArray](#parallelserverarray): A client connecting to parallel servers.
  - [ParallelServerClientArray](#parallelserverclientarray): Both of them. Accepts parallel clients and connects to parallel servers at the same time.

When you need the *Parallel Process*, then call one of them: [sendSegmentData()](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystemarray.html#sendsegmentdata) or [sendPieceData()](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystemarray.html#sendpiecedata). When the *Parallel Process* has completed, [ParallelSystemArray](#parallelsystemarray) estimates each [ParallelSystem](#parallelsystem)'s [performance index](#performance-index) basis on their execution time. Those [performance indices](#performance-index) will be refelcted to the next *Parallel Process*, how much pieces will be allocated to each [ParallelSystem](#parallelsystem).

```typescript
/// <reference types="samchon-framework" />

import samchon = require("samchon-framework");
import protocol = samchon.protocol;
import parallel = samchon.templates.parallel;

let parallel_systems: parallel.ParallelSystemArray;
let invoke: protocol.Invoke = new protocol.Invoke("optimize");

parallel_systems.sendSegmentData(invoke, 1000);
```

### [ParallelSystem](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystem.html)
A driver for a parallel **slave** system.

The [ParallelSystem](#parallelsystem) is an abstract class represents a **slave** system in *Parallel Processing System*, connected with this **master** system. The [ParallelSystem](#parallelsystem) takes full charge of network communication with the remote, parallel **slave** system has connected.

When a *Parallel Process* is requested (by [ParallelSystemArray.sendSegmentData](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystemarray.html#sendsegmentdata) or [ParallelSystemArray.sendPieceData](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystemarray.html#sendpiecedata)), the number of pieces to be allocated to a [ParallelSystem](#parallelsystem) is turn on its [performance index](#performance index). Higher performance index, then more pieces are requested. The [performance index](#performance index) is revaluated whenever a parallel process has completed, basic on the execution time and number of pieces. You can sugguest or enforce the performance index with [setPerformance](#setperformance) or [enforcePerformance](#enforceperformance).

##### Performance index
The [performance index](#performance index) indicates how much fast the remote **slave** system ([ParallelSystem](#parallelsystem)) is.

If the [ParallelSystem](#parallelsystem) does not have any [Invoke message](TypeScript-Protocol-Standard_Message#invoke) had handled, then the [performance index](#performance index) will be ```1.0```, which means default and average value between all [ParallelSystem](#parallelsystem) instances (that are belonged to a same [ParallelSystemArray](#parallelsystemarray) object).

You can specify the [performance index](#performance index) by yourself but notice that, if the [performance index](#performance index) is higher than other [ParallelSystem](#parallelsystem) objects, then the [ParallelSystem](#parallelsystem) object will be ordered to handle more processes than others. Otherwise, the [performance index](#performance-index) is lower than others, of course, less processes will be delivered.

When ```ParallelSystemArray.sendSegmentData($something, 100)``` has called,

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
Set [performance index](#performance index) and it's fixed. The newly configured [performance index](#performance index) does not be **revaluated**.

### [ExternalSystemRole](http://samchon.github.io/framework/api/ts/classes/samchon.templates.external.externalsystemrole.html)
This *Parallel System* module has implemented by extending the [External System](TypeScript-Templates-External_System) module. Thus, a [ParallelSystem](#parallelsystem) object can contain [ExternalSystemRole](#externalsystemrole) objects and utilizing the [Proxy Pattern](TypeScript-Templates-External_System#proxy-pattern) is also possible.

A role belonged to an external system.

The [ExternalSystemRole](#externalsystemrole) class represents a role, what to do. Extends this class and defines methods handling [Invoke message](TypeScript-Protocol-Standard_Message#invoke), which are related the specified role, what to do.

[ExternalSystemRole](#externalsystemrole) can be a *Logical Proxy* for an [ParallelSystem](#parallelsystem) which is containing the [ExternalSystemRole](#externalsystemrole). Of course, the [ExternalSystemRole](#externalsystemrole) is belonged to an [ParallelSystem](#parallelsystem). However, if you access an [ExternalSystemRole](#externalsystemrole) from an [ParallelSystemArray](#parallelsystemarray) directly, not passing by a belonged [ParallelSystem](#parallelsystem), and send an [Invoke message](TypeScript-Protocol-Standard_Message#invoke) even you're not knowing which [ParallelSystem](#parallelsystem) is related in, the [ExternalSystemRole](#externalsystemrole) acted a role of proxy.

With the *Logical Proxy*, you can only concentrate on [ExternalSystemRole](#externalsystemrole) itself, what to do with [Invoke messages](TypeScript-Protocol-Standard_Message#invoke), irrespective of the [ExternalSystemRole](#externalsystemrole) is belonged to which [ParallelSystem](#parallelsystem) object. Those pattern is called *Proxy Pattern*.

```typescript
/// <reference types="samchon-framework.d.ts" />

import samchon = require("samchon-framework");
import protocol = samchon.protocol;
import parallel = samchon.templates.parallel;

//--------
// MANAGER OF EXTERNAL FILE SERVERS' DRIVERS
//--------
var file_servers: parallel.ParallelSystemArray;

var png_data: Uint8Array; // DATA TO SAVE
var invoke: protocol.Invoke = new protocol.Invoke("save", "my_picture", "png", png_data); 
	// MESSAGE TO SEND

//--------
// YOU CAN SEND AN INVOKE MESSAGE WITHOUT SPECIFYING TARGET SYSTEM
// THE ExternalSystemRole OBJECT WILL ACT A ROLE NAMED "PROXY"
//--------
file_servers.getRole("image").sendData(invoke);
```

## Tree-structured Parallel Processing System
You can compose not only **1: N** *Parallel Processing System*, but also **tree-structured, recursive 1: N** *Parallel Processing System*.

![Conceptual Diagram](http://samchon.github.io/framework/images/design/conceptual_diagram/parallel_system.png)

### [ParallelSystemArrayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystemarraymediator.html)
Mediator of Parallel Processing System.

The [ParallelSystemArrayMediator](#parallelsystemarraymediator) class be a master for its slave systems, and be a slave to its master system at the same time. This [ParallelSystemArrayMediator](#parallelsystemarraymediator) be a master system, containing and managing [ParallelSystem](#parallelsystem) objects, which represent parallel slave systems, by extending [ParallelSystemArray](#parallelsystemarray) class. Also, be a slave system through mediator object, which is derived from the [SlavSystem](http://samchon.github.io/framework/api/ts/classes/samchon.templates.slave.slavesystem.html) class.

As a master, you can specify this [ParallelSystemArrayMediator](#parallelsystemarraymediator) class to be a master server accepting slave clients or a master client to connecting slave servers. Even both of them is possible. Extends one of them below and overrides abstract factory method(s) creating the child [ParallelSystem](#parallelsystem) object.

  - [ParallelClientArrayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelclientarraymediator.html): A server accepting parallel clients.
  - [ParallelServerArrayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelserverarraymediator.html): A client connecting to parallel servers.
  - [ParallelServerClientArrayMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelserverclientarraymediator.html): Both of them. Accepts parallel clients and connects to parallel servers at the same time.

As a slave, you can specify this [ParallelSystemArrayMediator](#parallelsystemarraymediator) to be a client slave connecting to master server or a server slave accepting master client by overriding the [createMediator](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystemarraymediator.html#createmediator) method. Overrides the [createMediator()](http://samchon.github.io/framework/api/ts/classes/samchon.templates.parallel.parallelsystemarraymediator.html#createmediator) method and returns one of them:

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
#### Related Modules
Referencing related modules, it will be much helpful for comprehending this *Parallel System Module*.

Name | Source | Documents
----|----|---
Distributed System | [templates/distributed](https://github.com/samchon/framework/tree/master/ts/src/samchon/templates/distributed) | [API](http://samchon.github.io/framework/api/ts/modules/samchon.templates.distributed.html), [Guidance](TypeScript-Templates-Distributed_System)
Slave System | [templates/slave](https://github.com/samchon/framework/tree/master/ts/src/samchon/templates/slave) | [API](http://samchon.github.io/framework/api/ts/modules/samchon.templates.slave.html), [Guidance](TypeScript-Templates-Slave_System)

#### Interaction
![Conceptual Diagram](http://samchon.github.io/framework/images/design/conceptual_diagram/interaction.png)

**Interaction** is an example implemented *Tree-structured Distributed & Parallel Processing System*. The Interaction provides ultimate guidance; how to use *External System* and its derived modules.

[**Go to the Interaction**](Examples-Interaction)

