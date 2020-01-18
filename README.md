# Samchon Framework
[![npm version](https://badge.fury.io/js/samchon.svg)](https://www.npmjs.com/package/samchon)
[![Downloads](https://img.shields.io/npm/dm/samchon.svg)](https://www.npmjs.com/package/samchon)
[![DeepScan Grade](https://deepscan.io/api/projects/1803/branches/7815/badge/grade.svg)](https://deepscan.io/dashboard/#view=project&pid=1803&bid=7815)
[![Chat on Gitter](https://badges.gitter.im/samchon/framework.svg)](https://gitter.im/samchon/framework?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)




> ## Deprecated, use [TGrid]((https://github.com/samchon/tgrid)) instead.
> [**TGrid**](https://github.com/samchon/tgrid) - TypeScript Grid Computing Framework 
>
> I've found a much better solution for implementing the [OON](#object-oriented-network) by realizing the true Grid Computing through the [RFC](https://github.com/samchon/tgrid#13-remote-function-call). [**TGrid**](https://github.com/samchon/tgrid) is a new framework for the solution. Therefore, [**TGrid**](https://github.com/samchon/tgrid) will replace this **Samchon Framework** and continue 
> developing the [OON](#object-oriented-network).
> 
> #### [`composite-calculator/server.ts`](https://github.com/samchon/tgrid.examples/blob/master/src/projects/composite-calculator/server.ts)
> ```typescript
> import { WebServer, WebAcceptor } from "tgrid/protocols/web";
> import { CompositeCalculator } from "../../providers/Calculator";
> 
> async function main(): Promise<void>
> {
>     let server: WebServer = new WebServer();
>     await server.open(10102, async (acceptor: WebAcceptor) =>
>     {
>         await acceptor.accept(new CompositeCalculator());
>     });
> }
> main();
> ```
> 
> #### [`composite-calculator/client.ts`](https://github.com/samchon/tgrid.examples/blob/master/src/projects/composite-calculator/client.ts)
> ```typescript
> import { WebConnector } from "tgrid/protocols/web/WebConnector";
> import { Driver } from "tgrid/components/Driver";
> 
> import { ICalculator } from "../../controllers/ICalculator";
> 
> async function main(): Promise<void>
> {
>     //----
>     // CONNECTION
>     //----
>     let connector: WebConnector = new WebConnector();
>     await connector.connect("ws://127.0.0.1:10102");
> 
>     //----
>     // CALL REMOTE FUNCTIONS
>     //----
>     // GET DRIVER
>     let calc: Driver<ICalculator> = connector.getDriver<ICalculator>();
> 
>     // FUNCTIONS IN THE ROOT SCOPE
>     console.log("1 + 6 =", await calc.plus(1, 6));
>     console.log("7 * 2 =", await calc.multiplies(7, 2));
> 
>     // FUNCTIONS IN AN OBJECT (SCIENTIFIC)
>     console.log("3 ^ 4 =", await calc.scientific.pow(3, 4));
>     console.log("log (2, 32) =", await calc.scientific.log(2, 32));
> 
>     try
>     {
>         // TO CATCH EXCEPTION IS STILL POSSIBLE
>         await calc.scientific.sqrt(-4);
>     }
>     catch (err)
>     {
>         console.log("SQRT (-4) -> Error:", err.message);
>     }
> 
>     // FUNCTIONS IN AN OBJECT (STATISTICS)
>     console.log("Mean (1, 2, 3, 4) =", await calc.statistics.mean(1, 2, 3, 4));
>     console.log("Stdev. (1, 2, 3, 4) =", await calc.statistics.stdev(1, 2, 3, 4));
> 
>     //----
>     // TERMINATE
>     //----
>     await connector.close();
> }
> main();
> ```
>
>> ```
>> 1 + 6 = 7
>> 7 * 2 = 14
>> 3 ^ 4 = 81
>> log (2, 32) = 5
>> SQRT (-4) -> Error: Negative value on sqaure.
>> Mean (1, 2, 3, 4) = 2.5
>> Stdev. (1, 2, 3, 4) = 1.118033988749895
>> ``` 


## Outline
### Object Oriented Network
![Network Connectivity to Class Relationship](https://camo.githubusercontent.com/31ef65b5de55a38b52de5a1f1e797268d8e22c4a/687474703a2f2f73616d63686f6e2e6769746875622e696f2f6672616d65776f726b2f696d616765732f6163636573736f72792f6f6f6e2e706e67)

Samchon Framework is an OON (Object-Oriented Network) framework. You can compose network systems within framework of the Object-Oriented. 

Whether how the network system is enormous and complicate, **the system nodes, they're just objects** in the Samchon Framework. Define <u>objects who represent the *system nodes*</u> and <u>deliver message by calling methods from objects to objects</u>. That's all.

### System Templates, Modules of OON
I repeat, Samchon is an OON (Object-Oriented Network) framework, composing a network system within framework of the Object-Oriented. It means that even **modulization** is possible and it's called **System Templates**. You can maximize the **reusability** with the **modulization, System Templates**.

When you need a cloud system, then take a System Template named [Cloud Service](https://github.com/samchon/framework/wiki/TypeScript-Templates-Cloud_Service). When you need a distributed processings system, then take the [Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed-System). If you should implement a specific network system and the network system will be used repeatedly, then **modulize** it to be one of the **System Templates**.

Below **System Templates** are basically provided in the Samchon Framework:

  - [Cloud Service](https://github.com/samchon/framework/wiki/TypeScript-Templates-Cloud_Service): Cloud Server Template
  - [External System](https://github.com/samchon/framework/wiki/TypeScript-Templates-External-System): A template for 1: N composite relationship's network system.
    - [Parallel System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Parallel-System): Parallel Processing System Template.
    - [Distributed System](https://github.com/samchon/framework/wiki/TypeScript-Templates-Distributed-System): Distributed Processing System Template.

### [TypeScript-STL](https://github.com/samchon/typescript-stl), interaction with TypeScript and C\++
[![Supported Languages](https://camo.githubusercontent.com/4cec4c0dde09984806b7a4353cba82e69dcd9bde/687474703a2f2f73616d63686f6e2e6769746875622e696f2f6672616d65776f726b2f696d616765732f6163636573736f72792f6c616e67756167655f6469616772616d2e706e67)](#interaction)

The best solution, for integrating and migrating a system built by different languages (TypeScript and C++), is to sharing same designs and grammers. Those designs and grammers are unitifed, then any other solution can't be better. Samchon Framework provides the best solution.

Unifying designs, it can be come true by utilizing the **Object-Oriented Network** paradigm with Samchon Framework. Unifying grammer, it also can be done by using the [**TypeScript-STL**](https://github.com/samchon/tstl), a sub-project who migrated C\++'s STL (Standard Template Library) to TypeScript. You can use STL's containers and algorithms in TypeScript with the [**TypeScript-STL**](https://github.com/samchon/tstl). Thus, you can unify not only designs but also grammers, algorithms and even data structures with the [**TypeScript-STL**](https://github.com/samchon/tstl).

#### Suggestion
If you're planning to build a cloud solution, then I sugguest you to follow such step:
  1. Fast Implementation
    1. Cloud Application with TypeScript & HTML 
    2. Cloud Service with TypeScripty & NodeJS
  2. Performance Improvement
    1. Heavy processes, distribute them to C\++ systems.
    2. Migrate Cloud server from TypeScript to C++ gradually.


## Installation
#### TypeScript
```bash
# Install NPM module.
npm install --save samchon
```

Installs Samchon-Framework from NPM module and imports the definition.

```typescript
/// <reference types="samchon" />
import samchon = require("samchon");
```

#### C++
Samchon Framework is a header only project. Linkages like LIB, DLL or SO are not required at all. **Just include header files what you want**. However, notice that, Samchon Framework has two dependencies you should install.
  - [Boost](http://www.boost.org) - essential.
  - [ODBC](https://en.wikipedia.org/wiki/Open_Database_Connectivity) - optional, required only when using SQL driver.

```cpp
#include <samchon/library.hpp>
#include <samchon/protocol.hpp>

#include <samchon/templates/service.hpp>
#include <samchon/templates/external.hpp>
#	include <samchon/templates/parallel.hpp>
#	include <samchon/templates/distributed.hpp>
```


## Documents
#### Architecture Designs
  - Class Diagrams
    - [TypeScript](http://samchon.github.io/framework/design/ts_class_diagram.pdf)
    - [C++](http://samchon.github.io/framework/design/cpp_class_diagram.pdf)
  - [Conceptual Diagram](http://samchon.github.io/framework/design/conceptual_diagram.pdf)
  - [Sequence Diagram](http://samchon.github.io/framework/design/sequence_diagram.pdf)

#### Guide Documents
  - [TypeScript](https://github.com/samchon/framework/wiki/TypeScript-Protocol-Basic_Components)
  - [C++](https://github.com/samchon/framework/wiki/CPP-Protocol-Basic_Components)
  - [Examples](https://github.com/samchon/framework/wiki/Examples-Interaction)
  
#### API Documents
  - **v2.0**
    - [**TypeScript**](http://samchon.github.io/framework/api/ts)
    - [__C++__](http://samchon.github.io/framework/api/cpp)
  - v1.0
    - [C++](http://samchon.github.io/framework/api/v1.0/cpp)
    - [Flex](http://samchon.github.io/framework/api/v1.0/flex)
