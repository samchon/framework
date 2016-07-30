# Samchon Framework

[![NPM](https://nodei.co/npm/samchon-framework.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/samchon-framework)

GitHub Repository: https://github.com/samchon/framework

## Introduction
#### Samchon Framework is
Samchon framework is a **SDN**<sup id="a_sdn">[1](#f_sdn)</sup> framework; who can build network system within framework of **OOD**<sup id="a_ood">[2](#f_ood)</sup>, like *cloud system* and *distributed* & *parallel processing systems*, even how the system is enormously complicate.

Samchon Framework supports two languages; **C++** and **TypeScript/NodeJs**. Not only connecting to an external server, but also opening a server is also possible both in *C++* and *TypeScript/NodeJS*. In my case, I prefer to build a cloud server with *TypeScript & NodeJS* quickly. When the cloud server grows up and lots of traffic occurs, I let the cloud server to deliver heavy processes to Distributed systems built via *C++*.

[![Supported Languages Diagram](http://samchon.github.io/framework/images/accessory/language_diagram.png)](#interaction)

#### What can we do
  1. Build [Cloud Server](https://github.com/samchon/framework/wiki/Conception-Modules-Service)
  2. Integrate systems with standard ~
    - Message protocol: [Invoke](https://github.com/samchon/framework/wiki/Conception-Message_Protocol#invoke)
    - Data expression method: [Entity](https://github.com/samchon/framework/wiki/Conception-Message_Protocol#entity)
  3. Construct complicate network system
    - Like
      - Interaction with [External Systems](https://github.com/samchon/framework/wiki/Conception-External_System)
      - (Tree-structured) [Parallel Processing System](https://github.com/samchon/framework/wiki/Conception-Parallel_System)
      - (Tree-structured) [Distributed Processing System](https://github.com/samchon/framework/wiki/Conception-Distributed_System)
    - Easily within framework of OOD<sup>[1](#f_ood)</sup>, by considering a system as a object (class), via [Basic Components](https://github.com/samchon/framework/wiki/Conception-Modules-Basic_Components)
  4. Utilize libraries independent on operating systems
    - Enable to cross-compile

![Interaction Movie](http://samchon.github.io/framework/images/example/interaction/demo.gif)

## Installation
#### C++
Samchon Framework has two dependencies in C++, **Boost libraries** and **ODBC**.
  - Install **Boost libraries** and enroll path of the *Boost libraries* in **environment variable's PATH**.
  - Install **ODBC** and enroll path of the *ODBC* in **environment variable's PATH**.

After installation and configuration of those dependencies, download or fork this repository. And follow those steps:
  * Go to the path *./cpp/samchon*.
  * Compile all *cpp* files.

#### TypeScript (NodeJS)
Installing *Samchon-Framework* in **NodeJS** is very easy. Just install with **npm**.
```bash
npm install -g samchon-framework
```

When importing *Samchon Framework* has installed, don't forget to referencing the header file ```samchon-framework.d.ts```
```typescript
/// <reference path="typings/samchon-framework/samchon-framework.d.ts" />
import samchon = require("samchon-framework");
```

##### TypeScript (Browser)
*Samchon Framework* follows **commonjs** module. Thus, you can't use ~~RequireJS~~. However, using **Browserify** is possible.

If you want to include directly without the *Browserify*, then you've to include **TypeScript-STL** first and Samchon-Framework laster.

```javascript
<head>
	<title> Samchon-Framework requires TypeScript-STL </title>
	<script src="include/typescript-stl.js"></script> <!-- MUST BE INCLUDED FIRST -->
	<script src="include/samchon-framework.js"></script> <!-- MUST BE INCLUDED AFTER TYPESCRIPT-STL -->
</head>
```

## References
#### API Documents
  - [C++ API Documents](http://samchon.github.io/framework/api/cpp)
  - [TypeScript API Documents](http://samchon.github.io/framework/api/ts)

#### Architecture Designs
  - [C++ Class Diagram](http://samchon.github.io/framework/design/cpp_class_diagram.pdf)
  - [TypeScript Class Diagram](http://samchon.github.io/framework/design/ts_class_diagram.pdf)
  - [Sequence Diagram](http://samchon.github.io/framework/design/sequence_diagram.pdf)

#### Handbook
- [**Conception**](https://github.com/samchon/framework/wiki/Conception)
  - [What SDN is?](https://github.com/samchon/framework/wiki/Conception-SDN)
  - [Prime Modules](https://github.com/samchon/framework/wiki/Conception-Modules)
    - [Basic Components](https://github.com/samchon/framework/wiki/Conception-Modules-Basic_Components)
      - [IProtocol](https://github.com/samchon/framework/wiki/Conception-Modules-Basic_Components#iprotocol)
      - [Communicator](https://github.com/samchon/framework/wiki/Conception-Modules-Basic_Components#communicator)
      - [ServerConnector](https://github.com/samchon/framework/wiki/Conception-Modules-Basic_Components#serverconnector)
  	  - [Server](https://github.com/samchon/framework/wiki/Conception-Modules-Basic_Components#server)
    - [Cloud Service](https://github.com/samchon/framework/wiki/Conception-Modules-Service)
    - [External System](https://github.com/samchon/framework/wiki/Conception-External_System)
      - [Parallel System](https://github.com/samchon/framework/wiki/Conception-Parallel_System)
      - [Distributed System](https://github.com/samchon/framework/wiki/Conception-Distributed_System)
  - [Message Protocol](https://github.com/samchon/framework/wiki/Conception-Message_Protocol)
    - [Invoke](https://github.com/samchon/framework/wiki/Conception-Message_Protocol#invoke)
    - [IProtocol](https://github.com/samchon/framework/wiki/Conception-Message_Protocol#iprotocol)
    - [Entity](https://github.com/samchon/framework/wiki/Conception-Message_Protocol#entity)
- [**Tutorial - _TypeScript_**](https://github.com/samchon/framework/wiki/Tutorial-TypeScript)
  - [Basic Libraries](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Libraries)
    - [XML](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Libraries-XML)
    - [EventDispatcher](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Libraries-EventDispatcher)
    - [Collection](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Libraries-Collection)
  - [Network](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Network)
    - [Protocol](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Protocol)
      - [Invoke](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Protocol#invoke)
      - [IProtocol](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Protocol#iprotocol)
      - [Entity](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Protocol#entity)
    - [Basic Components](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Protocol-Basic_Components)
    - [Service](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Protocol-Service)
    - [External System](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Protocol-External_System)
      - [Parallel System](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Protocol-Parallel_System)
      - [Distributed System](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Protocol-Distributed_System)
      - [Slave System](https://github.com/samchon/framework/wiki/Tutorial-TypeScript-Protocol-Slave_System)
- [**Examples**](https://github.com/samchon/framework/wiki/Examples)
  - [Samchon Simulation Cloud, older example](https://github.com/samchon/framework/wiki/Examples-Simulation)
  - [Web-Chatting, Cloud-Server and Web-Application](https://github.com/samchon/framework/wiki/Examples-Chatting)
  - [Interaction, Tree-structured Distributed System](https://github.com/samchon/framework/wiki/Examples-Interaction)
  - [Packer, 3D Bin Packing with multiple Boxes](https://github.com/samchon/framework/wiki/Examples-Packer)

## License
#### BSD License
*Samchon Framework* follows [BSD-3-Clause](http://spdx.org/licenses/BSD-3-Clause) license.

#### Dependencies
- C++
  - [Boost.Asio](http://www.boost.org/doc/libs/1_61_0/doc/html/boost_asio.html)
  - [ODBC](https://support.microsoft.com/en-us/kb/110093)
- TypeScript
  - [TypeScript-STL](https://github.com/samchon/typescript-stl)
  - [WebSocket](https://github.com/theturtle32/WebSocket-Node)

-------------------------------

<b id="f_sdn">[[1]](#a_sdn)</b> Software Defined Network <br />
<b id="f_ood">[[2]](#f_ood)</b> Object-Oriented Design